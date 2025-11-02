<?php

namespace App\Http\Controllers\usermanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserManagamentController extends Controller
{
    public function index(Request $request)
    {
        // Build query for users
        $query = User::query();
        
        // Apply search filter
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('contact_number', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
            });
        }
        
        // Apply role filter
        if ($request->has('role') && $request->role != '' && $request->role != 'all') {
            $query->where('role', $request->role);
        }
        
        $perPage = $request->input('per_page', 10);
        $users = $query->orderBy('id', 'asc')->paginate($perPage);
        
        // Get distinct roles from the database
        $roles = User::whereNotNull('role')
                    ->where('role', '!=', '')
                    ->distinct()
                    ->pluck('role')
                    ->sort()
                    ->values();
        
        return view('usermanagement.usermanagement', compact('users', 'roles'));
    }

    public function create()
    {
        return view('usermanagement.create-user-management');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'gender' => ['required', 'string'],
            'contact_number' => ['nullable', 'string', 'max:255'],
            'street' => ['nullable', 'string', 'max:255'],
            'lot' => ['nullable', 'string', 'max:255'],
            'block' => ['nullable', 'string', 'max:255'],
            'membership_fee' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'in:admin,home owners,non home owners,guard,operational manager,service manager,financial manager,appointment coordinator,occupancy manager'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:5120'],
        ]);

        $photoFilename = null;
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $extension = $photo->getClientOriginalExtension();
            $photoFilename = time() . '_' . Str::random(8) . '.' . $extension;

            $destination = public_path('uploads/profiles');
            File::ensureDirectoryExists($destination);
            $photo->move($destination, $photoFilename);
        }

        $user = new User();
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->password = Hash::make($validated['password']);
        $user->gender = $validated['gender'];
        $user->contact_number = $request->input('contact_number');
        $user->street = $request->input('street');
        $user->lot = $request->input('lot');
        $user->block = $request->input('block');
        $user->membership_fee = $request->input('membership_fee');
        $user->role = $request->input('role');
        $user->photo = $photoFilename;
        $user->active = 1; // auto-active
        $user->save();

        return response()->json([
            'message' => 'User created successfully',
            'id' => $user->id,
        ], 201);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    public function show(User $user)
    {
        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'gender' => ['nullable', 'string'],
            'contact_number' => ['nullable', 'string', 'max:255'],
            'street' => ['nullable', 'string', 'max:255'],
            'lot' => ['nullable', 'string', 'max:255'],
            'block' => ['nullable', 'string', 'max:255'],
            'membership_fee' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'in:admin,home owners,non home owners,guard,operational manager,service manager,financial manager,appointment coordinator,occupancy manager'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:5120'],
        ]);

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $extension = $photo->getClientOriginalExtension();
            $photoFilename = time() . '_' . Str::random(8) . '.' . $extension;
            $destination = public_path('uploads/profiles');
            File::ensureDirectoryExists($destination);
            $photo->move($destination, $photoFilename);
            $user->photo = $photoFilename;
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        if (isset($validated['gender'])) $user->gender = $validated['gender'];
        $user->contact_number = $request->input('contact_number');
        $user->street = $request->input('street');
        $user->lot = $request->input('lot');
        $user->block = $request->input('block');
        $user->membership_fee = $request->input('membership_fee');
        $user->role = $request->input('role');
        $user->save();

        return response()->json(['message' => 'User updated successfully']);
    }

    public function toggleStatus(Request $request, User $user)
    {
        try {
            
            $validated = $request->validate([
                'active' => 'required|in:0,1'
            ]);

            $active = $validated['active'];
            $user->active = $active;
            $user->save();

            // Activity logging
            try {
                if (auth()->check()) {
                    $statusText = $active == 1 ? 'activated' : 'deactivated';
                    auth()->user()->logCustom(
                        "User {$statusText}: {$user->name} ({$user->email})"
                    );
                }
            } catch (\Exception $e) {
                Log::error('Error logging user status toggle: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => $active == 1 ? 'User activated successfully' : 'User deactivated successfully',
                'active' => $active
            ]);

        } catch (\Exception $e) {
            Log::error('Toggle user status error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating user status: ' . $e->getMessage()
            ], 500);
        }
    }
}
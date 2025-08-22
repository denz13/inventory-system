<?php

namespace App\Http\Controllers\profilemanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\tbl_tenant_list;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileManagementController extends Controller
{
    public function index()
    {
        try {
            // Get current logged-in user
            $user = Auth::user();
            
            // Get user statistics based on available User model fields
            $stats = [
                'orders' => $user->is_with_title === 'yes' ? 'Yes' : 'No', // Title status
                'purchases' => $user->membership_fee ?? '0', // Membership fee
                'reviews' => $user->gender ?? 'N/A' // Gender
            ];

            // Get user's tenants
            $tenants = tbl_tenant_list::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return view('profile-management.profile-management', compact('user', 'stats', 'tenants'));
        } catch (\Exception $e) {
            return back()->with('error', 'Error loading profile: ' . $e->getMessage());
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . Auth::id(),
                'contact_number' => 'nullable|string|max:20',
                'gender' => 'nullable|in:male,female,other',
                'street' => 'nullable|string|max:255',
                'lot' => 'nullable|string|max:100',
                'block' => 'nullable|string|max:100',
                'date_of_birth' => 'nullable|date',
                'civil_status' => 'nullable|in:single,married,widowed,divorced',
                'number_of_months_stay' => 'nullable|string|max:50',
                'telephone_number' => 'nullable|string|max:20',
                'fb_account' => 'nullable|string|max:255',
                'messenger_account' => 'nullable|string|max:255',
                'prepared_contact' => 'nullable|string|max:255',
                'caretaker_name' => 'nullable|string|max:255',
                'caretaker_address' => 'nullable|string',
                'caretaker_contact_number' => 'nullable|string|max:20',
                'caretaker_email' => 'nullable|email|max:255',
                'incase_of_emergency' => 'nullable|string|max:255',
            ]);

            $user = Auth::user();
            
            // All fields are varchar in database, so we can use them directly
            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
                'contact_number' => $request->contact_number,
                'gender' => $request->gender,
                'street' => $request->street,
                'lot' => $request->lot,
                'block' => $request->block,
                'date_of_birth' => $request->date_of_birth,
                'civil_status' => $request->civil_status,
                'number_of_months_stay' => $request->number_of_months_stay,
                'telephone_number' => $request->telephone_number,
                'fb_account' => $request->fb_account,
                'messenger_account' => $request->messenger_account,
                'prepared_contact' => $request->prepared_contact,
                'caretaker_name' => $request->caretaker_name,
                'caretaker_address' => $request->caretaker_address,
                'caretaker_contact_number' => $request->caretaker_contact_number,
                'caretaker_email' => $request->caretaker_email,
                'incase_of_emergency' => $request->incase_of_emergency,
            ];

            $user->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully!',
                'user' => $user->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating profile: ' . $e->getMessage()
            ]);
        }
    }

    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'current_password' => 'required',
                'new_password' => 'required|min:8|confirmed',
            ]);

            $user = Auth::user();

            // Check current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 400);
            }

            // Update password
            $user->update([
                'password' => Hash::make($request->new_password)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error changing password: ' . $e->getMessage()
            ], 500);
        }
    }

    public function uploadPhoto(Request $request)
    {
        try {
            $request->validate([
                'profile_photo' => 'required|file|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            ], [
                'profile_photo.required' => 'Please select a photo to upload.',
                'profile_photo.image' => 'The uploaded file must be an image.',
                'profile_photo.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif, webp.',
                'profile_photo.max' => 'The image must not be larger than 5MB.',
            ]);

            $user = Auth::user();

            if ($request->hasFile('profile_photo')) {
                $file = $request->file('profile_photo');
                
                // Generate unique filename
                $fileName = time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
                
                // Store file in storage/app/public/profiles directory
                $filePath = $file->storeAs('public/profiles', $fileName);
                
                // Delete old photo if it exists
                if ($user->photo && Storage::exists('public/profiles/' . $user->photo)) {
                    Storage::delete('public/profiles/' . $user->photo);
                }

                // Update user photo in database (store just the filename)
                $user->update([
                    'photo' => $fileName
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Profile photo updated successfully',
                    'photo_url' => $user->photo_url
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'No file uploaded'
            ], 400);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Photo upload error: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error uploading photo: ' . $e->getMessage()
            ], 500);
        }
    }

    public function addTenant(Request $request)
    {
        try {
            $request->validate([
                'full_name' => 'required|string|max:255',
                'relationship' => 'nullable|string|max:100',
                'contact_number' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'photo' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            ], [
                'full_name.required' => 'Full name is required.',
                'full_name.max' => 'Full name must not exceed 255 characters.',
                'email.email' => 'Please provide a valid email address.',
                'photo.image' => 'The uploaded file must be an image.',
                'photo.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif, webp.',
                'photo.max' => 'The image must not be larger than 5MB.',
            ]);

            $user = Auth::user();
            $tenantData = [
                'user_id' => $user->id,
                'full_name' => $request->full_name,
                'relationship' => $request->relationship,
                'contact_number' => $request->contact_number,
                'email' => $request->email,
                'status' => 'active', // Automatically set to active
            ];

            // Handle photo upload if provided
            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('public/tenants', $fileName);
                $tenantData['photo'] = $fileName;
            }

            // Create the tenant
            $tenant = tbl_tenant_list::create($tenantData);

            return response()->json([
                'success' => true,
                'message' => 'Tenant added successfully',
                'tenant' => $tenant
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Tenant creation error: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error adding tenant: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateTenant(Request $request, $id)
    {
        try {
            $request->validate([
                'full_name' => 'required|string|max:255',
                'relationship' => 'nullable|string|max:100',
                'contact_number' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'photo' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            ]);

            $user = Auth::user();
            $tenant = tbl_tenant_list::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$tenant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tenant not found or you do not have permission to edit this tenant'
                ], 404);
            }

            $tenantData = [
                'full_name' => $request->full_name,
                'relationship' => $request->relationship,
                'contact_number' => $request->contact_number,
                'email' => $request->email,
            ];

            // Handle photo upload if provided
            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('public/tenants', $fileName);
                
                // Delete old photo if it exists
                if ($tenant->photo && Storage::exists('public/tenants/' . $tenant->photo)) {
                    Storage::delete('public/tenants/' . $tenant->photo);
                }
                
                $tenantData['photo'] = $fileName;
            }

            // Update the tenant
            $tenant->update($tenantData);

            return response()->json([
                'success' => true,
                'message' => 'Tenant updated successfully',
                'tenant' => $tenant->fresh()
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Tenant update error: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'tenant_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error updating tenant: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteTenant($id)
    {
        try {
            $user = Auth::user();
            $tenant = tbl_tenant_list::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$tenant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tenant not found or you do not have permission to delete this tenant'
                ], 404);
            }

            // Delete photo if it exists
            if ($tenant->photo && Storage::exists('public/tenants/' . $tenant->photo)) {
                Storage::delete('public/tenants/' . $tenant->photo);
            }

            // Delete the tenant
            $tenant->delete();

            return response()->json([
                'success' => true,
                'message' => 'Tenant deleted successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Tenant deletion error: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'tenant_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error deleting tenant: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getTenant($id)
    {
        try {
            $user = Auth::user();
            $tenant = tbl_tenant_list::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$tenant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tenant not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'tenant' => $tenant
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving tenant: ' . $e->getMessage()
            ], 500);
        }
    }
}

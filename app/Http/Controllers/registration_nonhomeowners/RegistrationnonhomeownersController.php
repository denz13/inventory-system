<?php

namespace App\Http\Controllers\registration_nonhomeowners;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegistrationnonhomeownersController extends Controller
{
    public function index()
    {
        return view('registration_nonhomeowners.registration_nonhomeowners');
    }

    public function store(Request $request)
    {
        // Debug: Log incoming data
        \Log::info('Registration attempt', [
            'data' => $request->except('password'),
            'has_photo' => $request->hasFile('photo'),
        ]);
        
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'contact_number' => 'required|string|max:20',
                'gender' => 'required|in:Male,Female',
                'email' => 'required|email|unique:users,email',
                    'password' => 'required|string|min:8',
                'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'date_of_birth' => 'required|date',
                'civil_status' => 'required|in:Single,Married,Divorced,Widowed',
            ], [
                'name.required' => 'Full name is required',
                'contact_number.required' => 'Contact number is required',
                'gender.required' => 'Gender is required',
                'gender.in' => 'Gender must be Male or Female',
                'email.required' => 'Email address is required',
                'email.email' => 'Please enter a valid email address',
                'email.unique' => 'This email is already registered',
                'password.required' => 'Password is required',
                'password.min' => 'Password must be at least 8 characters',
                'photo.image' => 'Photo must be an image file',
                'photo.mimes' => 'Photo must be jpeg, png, or jpg format',
                'photo.max' => 'Photo size must not exceed 2MB',
                'date_of_birth.required' => 'Date of birth is required',
                'date_of_birth.date' => 'Please enter a valid date',
                'civil_status.required' => 'Civil status is required',
                'civil_status.in' => 'Please select a valid civil status',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                    'message' => 'Validation failed'
                ], 422);
            }

            // Handle photo upload
            $photoName = null;
            if ($request->hasFile('photo')) {
                $photo = $request->file('photo');
                $photoName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                
                // Store in storage/app/public/profiles (accessible via storage/profiles)
                $photo->storeAs('public/profiles', $photoName);
            }

            // Create user
            $user = User::create([
                'name' => $request->name,
                'contact_number' => $request->contact_number,
                'gender' => $request->gender,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'photo' => $photoName,
                'role' => 'non home owners',
                'active' => 0, // Pending
                'date_of_birth' => $request->date_of_birth,
                'civil_status' => $request->civil_status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Registration successful! Your account is pending approval. You will receive a notification once approved.',
                'data' => [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error during registration: ' . $e->getMessage()
            ], 500);
        }
    }
}

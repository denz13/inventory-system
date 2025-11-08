<?php

namespace App\Http\Controllers\profilemanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\tbl_tenant_list;
use App\Models\business_management_list;
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
                'orders' => $user->role ?? 'User', // User role
                'purchases' => $user->membership_fee ?? '0', // Membership fee
                'reviews' => $user->gender ?? 'N/A' // Gender
            ];

            // Get user's tenants
            $tenants = tbl_tenant_list::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            // Get user's businesses
            $businesses = business_management_list::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return view('profile-management.profile-management', compact('user', 'stats', 'tenants', 'businesses'));
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
                'telephone_number' => 'nullable|string|max:20',
                'fb_account' => 'nullable|string|max:255',
                'messenger_account' => 'nullable|string|max:255',
                'caretaker_name' => 'nullable|string|max:255',
                'caretaker_address' => 'nullable|string',
                'caretaker_contact_number' => 'nullable|string|max:20',
                'caretaker_email' => 'nullable|email|max:255',
                'incase_of_emergency' => 'nullable|string|max:255',
                'signature_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $user = Auth::user();
            
            // Handle signature image upload
            $signatureImagePath = $user->signature_image; // Keep existing if no new upload
            
            // Clean up existing signature path if it contains full path
            if ($signatureImagePath && strpos($signatureImagePath, 'signatures/') === 0) {
                $signatureImagePath = basename($signatureImagePath);
            }
            
            if ($request->hasFile('signature_image')) {
                $signatureFile = $request->file('signature_image');
                $signatureFileName = 'signature_' . time() . '_' . $user->id . '.' . $signatureFile->getClientOriginalExtension();
                
                // Store in storage/app/public/signatures
                $signatureFile->storeAs('signatures', $signatureFileName, 'public');
                
                // Store only the filename in database, not the full path
                $signatureImagePath = $signatureFileName;
                
                // Delete old signature if exists
                if ($user->signature_image && Storage::disk('public')->exists('signatures/' . basename($user->signature_image))) {
                    Storage::disk('public')->delete('signatures/' . basename($user->signature_image));
                }
            }
            
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
                'telephone_number' => $request->telephone_number,
                'fb_account' => $request->fb_account,
                'messenger_account' => $request->messenger_account,
                'caretaker_name' => $request->caretaker_name,
                'caretaker_address' => $request->caretaker_address,
                'caretaker_contact_number' => $request->caretaker_contact_number,
                'caretaker_email' => $request->caretaker_email,
                'incase_of_emergency' => $request->incase_of_emergency,
                'signature_image' => $signatureImagePath,
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
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
                'new_password_confirmation' => 'required|string',
            ]);

            $user = Auth::user();

            // Check if current password is correct
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ]);
            }

            // Update password
            $user->update([
                'password' => Hash::make($request->new_password)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error changing password: ' . $e->getMessage()
            ]);
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

    // Business Management Methods
    public function addBusiness(Request $request)
    {
        try {
            $request->validate([
                'type_of_business' => 'required|string|max:255',
                'business_name' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
            ]);

            $user = Auth::user();

            $businessData = [
                'user_id' => $user->id,
                'type_of_business' => $request->type_of_business,
                'business_name' => $request->business_name,
                'address' => $request->address,
                'status' => 'pending', // Always set to pending
            ];

            // Handle business clearance file upload
            if ($request->hasFile('business_clearance')) {
                $file = $request->file('business_clearance');
                $fileName = 'clearance_' . time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
                
                // Store in storage/app/public/business-clearances
                $file->storeAs('business-clearances', $fileName, 'public');
                
                // Store only the filename in database
                $businessData['business_clearance'] = $fileName;
            }

            $business = business_management_list::create($businessData);

            return response()->json([
                'success' => true,
                'message' => 'Business added successfully',
                'business' => $business->fresh()
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Business creation error: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error adding business: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateBusiness(Request $request, $id)
    {
        try {
            \Log::info('Updating business - FULL REQUEST INFO', [
                'business_id' => $id,
                'user_id' => Auth::id(),
                'request_method' => $request->method(),
                'request_url' => $request->url(),
                'request_headers' => $request->headers->all(),
                'request_data' => $request->all(),
                'request_files' => $request->allFiles(),
                'has_business_clearance' => $request->hasFile('business_clearance'),
                'business_clearance_size' => $request->file('business_clearance') ? $request->file('business_clearance')->getSize() : 'no file',
                'content_type' => $request->header('Content-Type'),
                'content_length' => $request->header('Content-Length')
            ]);
            
            // Temporarily simplify validation to isolate the issue
            $request->validate([
                'type_of_business' => 'required|string|max:255',
                'business_name' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
            ]);

            $user = Auth::user();
            $business = business_management_list::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$business) {
                return response()->json([
                    'success' => false,
                    'message' => 'Business not found or you do not have permission to update this business'
                ], 404);
            }

            $businessData = [
                'type_of_business' => $request->type_of_business,
                'business_name' => $request->business_name,
                'address' => $request->address,
            ];

            // If business was declined, automatically set status to pending for re-review
            if (strtolower($business->status) === 'declined') {
                $businessData['status'] = 'pending';
                $businessData['reason'] = null; // Clear the decline reason
            }

            // Handle business clearance file upload
            if ($request->hasFile('business_clearance')) {
                $file = $request->file('business_clearance');
                $fileName = 'clearance_' . time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
                
                // Store in storage/app/public/business-clearances
                $file->storeAs('business-clearances', $fileName, 'public');
                
                // Delete old clearance file if exists
                if ($business->business_clearance && Storage::disk('public')->exists('business-clearances/' . $business->business_clearance)) {
                    Storage::disk('public')->delete('business-clearances/' . $business->business_clearance);
                }
                
                // Store only the filename in database
                $businessData['business_clearance'] = $fileName;
            }

            // Update the business
            $business->update($businessData);

            return response()->json([
                'success' => true,
                'message' => 'Business updated successfully' . (strtolower($business->status) === 'declined' ? ' and status reset to pending for re-review' : ''),
                'business' => $business->fresh()
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Business update validation failed', [
                'business_id' => $id,
                'user_id' => Auth::id(),
                'validation_errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Business update error: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'business_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error updating business: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteBusiness($id)
    {
        try {
            $user = Auth::user();
            $business = business_management_list::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$business) {
                return response()->json([
                    'success' => false,
                    'message' => 'Business not found or you do not have permission to delete this business'
                ], 404);
            }

            // Delete business clearance file if exists
            if ($business->business_clearance && Storage::disk('public')->exists('business-clearances/' . $business->business_clearance)) {
                Storage::disk('public')->delete('business-clearances/' . $business->business_clearance);
            }

            // Delete the business
            $business->delete();

            return response()->json([
                'success' => true,
                'message' => 'Business deleted successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Business deletion error: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'business_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error deleting business: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getBusiness($id)
    {
        try {
            \Log::info('Attempting to get business', [
                'business_id' => $id, 
                'user_id' => Auth::id(),
                'user_authenticated' => Auth::check(),
                'request_method' => request()->method(),
                'request_url' => request()->url()
            ]);
            
            $user = Auth::user();
            
            if (!$user) {
                \Log::error('User not authenticated');
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            $business = business_management_list::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            \Log::info('Business query result', [
                'business_found' => $business ? true : false, 
                'business_data' => $business,
                'query_sql' => business_management_list::where('id', $id)->where('user_id', $user->id)->toSql(),
                'query_bindings' => ['id' => $id, 'user_id' => $user->id]
            ]);

            if (!$business) {
                \Log::warning('Business not found or access denied', [
                    'business_id' => $id, 
                    'user_id' => $user->id,
                    'all_businesses_for_user' => business_management_list::where('user_id', $user->id)->pluck('id')->toArray()
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Business not found or you do not have permission to view this business'
                ], 404);
            }

            \Log::info('Business retrieved successfully', ['business' => $business->toArray()]);

            return response()->json([
                'success' => true,
                'business' => $business
            ]);

        } catch (\Exception $e) {
            \Log::error('Error retrieving business: ' . $e->getMessage(), [
                'business_id' => $id,
                'user_id' => Auth::id(),
                'exception_class' => get_class($e),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving business: ' . $e->getMessage()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\business_management_list;
use App\Models\User;
use App\Models\notification_settings;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class BusinessController extends Controller
{
    public function index(Request $request)
    {
        // Get per_page from request, default to 10
        $perPage = $request->input('per_page', 10);
        
        // Start query - Get current user's businesses only
        $query = business_management_list::with('user')
            ->where('user_id', Auth::id());
        
        // Search functionality
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('business_name', 'LIKE', "%{$search}%")
                  ->orWhere('type_of_business', 'LIKE', "%{$search}%")
                  ->orWhere('address', 'LIKE', "%{$search}%");
            });
        }
        
        // Status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Order by creation date
        $query->orderBy('created_at', 'desc');
        
        // Paginate results and append query parameters
        $businesses = $query->paginate($perPage)->appends($request->except('page'));

        return view('business.business', compact('businesses'));
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'business_name' => 'required|string|max:255',
                'type_of_business' => 'required|string|max:255',
                'address' => 'nullable|string|max:500',
                'business_clearance' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            ]);

            // Handle file upload
            $filePath = null;
            if ($request->hasFile('business_clearance')) {
                $file = $request->file('business_clearance');
                $fileName = time() . '_' . $file->getClientOriginalName();
                // Store file and save full path in database
                $filePath = $file->storeAs('business-clearances', $fileName, 'public');
            }

            // Create business with logged-in user
            $business = business_management_list::create([
                'user_id' => Auth::id(),
                'business_name' => $validated['business_name'],
                'type_of_business' => $validated['type_of_business'],
                'address' => $validated['address'] ?? null,
                'business_clearance' => $filePath, // Store full path: business-clearances/filename.jpg
                'status' => 'pending',
                'reason' => null,
            ]);

            // Send notifications to users who have business management notifications enabled
            $this->sendBusinessNotifications(
                'New Business Registration',
                "New business '{$business->business_name}' has been registered by " . Auth::user()->name,
                'info'
            );

            return response()->json([
                'success' => true,
                'message' => 'Business registered successfully',
                'business' => $business->load('user')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error registering business: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $business = business_management_list::with('user')->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'business' => $business
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Business not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $business = business_management_list::findOrFail($id);
            
            // Check if the current user owns this business
            if ($business->user_id != Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only edit your own business'
                ], 403);
            }

            $validated = $request->validate([
                'business_name' => 'required|string|max:255',
                'type_of_business' => 'required|string|max:255',
                'address' => 'nullable|string|max:500',
                'business_clearance' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            ]);

            // Handle file upload
            if ($request->hasFile('business_clearance')) {
                // Delete old file if exists
                if ($business->business_clearance && Storage::disk('public')->exists($business->business_clearance)) {
                    Storage::disk('public')->delete($business->business_clearance);
                }
                
                $file = $request->file('business_clearance');
                $fileName = time() . '_' . $file->getClientOriginalName();
                // Store file and save full path in database
                $filePath = $file->storeAs('business-clearances', $fileName, 'public');
                $validated['business_clearance'] = $filePath; // Store full path: business-clearances/filename.jpg
            }

            $business->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Business updated successfully',
                'business' => $business->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating business: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $business = business_management_list::findOrFail($id);
            
            // Check if the current user owns this business
            if ($business->user_id != Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only delete your own business'
                ], 403);
            }
            
            // Delete file if exists
            if ($business->business_clearance && Storage::disk('public')->exists($business->business_clearance)) {
                Storage::disk('public')->delete($business->business_clearance);
            }
            
            $business->delete();

            return response()->json([
                'success' => true,
                'message' => 'Business deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting business'
            ], 500);
        }
    }

    /**
     * Send notifications to users with apply business notifications enabled
     */
    private function sendBusinessNotifications($title, $message, $type = 'info')
    {
        try {
            // Get the "apply business" module
            $module = \App\Models\module::where('module_name', 'apply business')->first();
            
            \Log::info('Business Notification - Module Search', [
                'searching_for' => 'apply business',
                'module_found' => $module ? $module->module_name : 'NOT FOUND',
                'module_id' => $module ? $module->id : null
            ]);
            
            if (!$module) {
                \Log::warning('apply business module not found in database');
                return;
            }

            // Get all users who have notifications enabled for apply business
            $notificationSettings = notification_settings::where('module_id', $module->id)
                ->where('status', 'active')
                ->with('user')
                ->get();

            \Log::info('Notification Settings Found', [
                'count' => $notificationSettings->count(),
                'user_ids' => $notificationSettings->pluck('users_id')->toArray()
            ]);

            if ($notificationSettings->isEmpty()) {
                \Log::warning('No users have notifications enabled for apply business module');
                return;
            }

            $notificationsSent = 0;
            foreach ($notificationSettings as $setting) {
                if ($setting->user) {
                    try {
                        \Log::info('Sending notification to user', [
                            'user_id' => $setting->user->id,
                            'user_name' => $setting->user->name,
                            'user_email' => $setting->user->email,
                            'title' => $title,
                            'message' => $message
                        ]);
                        
                        $notification = $setting->user->sendCustomNotification($type, $title, $message, $module->id);
                        
                        \Log::info('Notification created successfully', [
                            'notification_id' => $notification->id,
                            'user_id' => $setting->user->id
                        ]);
                        
                        $notificationsSent++;
                    } catch (\Exception $e) {
                        \Log::error('Error sending notification to user', [
                            'user_id' => $setting->user->id,
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString()
                        ]);
                    }
                }
            }
            
            \Log::info('Notifications completed', [
                'total_sent' => $notificationsSent
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error in sendBusinessNotifications', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
}

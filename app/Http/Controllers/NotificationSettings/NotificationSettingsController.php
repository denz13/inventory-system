<?php

namespace App\Http\Controllers\NotificationSettings;

use App\Http\Controllers\Controller;
use App\Models\notification_settings;
use App\Models\User;
use App\Models\module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class NotificationSettingsController extends Controller
{
    public function index(Request $request)
    {
        // Get per_page from request, default to 10
        $perPage = $request->input('per_page', 10);
        
        // Start with base query
        $query = notification_settings::with(['user', 'module']);
        
        // Apply search filter
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('user', function($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                             ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhereHas('module', function($moduleQuery) use ($search) {
                    $moduleQuery->where('module_name', 'like', "%{$search}%");
                });
            });
        }
        
        // Apply status filter
        if ($request->has('status') && $request->status != '' && $request->status != 'all') {
            $query->where('status', $request->status);
        }
        
        // Apply module filter
        if ($request->has('module_filter') && $request->module_filter != '' && $request->module_filter != 'all') {
            $query->where('module_id', $request->module_filter);
        }
        
        // Order and paginate
        $notificationSettings = $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->appends($request->except('page'));
        
        $users = User::where('active', 1)->orderBy('name')->get();
        $modules = module::where('status', 'active')->orderBy('module_name')->get();
        
        // Get distinct roles from users table
        $roles = User::select('role')
            ->distinct()
            ->whereNotNull('role')
            ->where('role', '!=', '')
            ->orderBy('role')
            ->pluck('role');
        
        return view('notification_settings.notification_settings', compact('notificationSettings', 'users', 'modules', 'roles'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'users_id' => 'required|exists:users,id',
            'status' => 'required|in:active,inactive',
            'modules' => 'required|array|min:1',
            'modules.*' => 'required|exists:module,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();
            
            // Create notification settings for each selected module
            $settings = [];
            foreach ($request->modules as $moduleId) {
                // Check if setting already exists for this user-module combination
                $existing = notification_settings::where('users_id', $request->users_id)
                    ->where('module_id', $moduleId)
                    ->first();
                
                if (!$existing) {
                    $setting = notification_settings::create([
                        'users_id' => $request->users_id,
                        'status' => $request->status,
                        'module_id' => $moduleId
                    ]);
                    $settings[] = $setting;
                }
            }
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Notification settings created successfully',
                'settings' => $settings
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Error creating notification settings: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $setting = notification_settings::with(['user', 'module'])->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'setting' => $setting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Notification setting not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'users_id' => 'required|exists:users,id',
            'status' => 'required|in:active,inactive',
            'modules' => 'required|array|min:1',
            'modules.*' => 'required|exists:module,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();
            
            $setting = notification_settings::findOrFail($id);
            
            // Update the current setting with the first selected module
            $setting->update([
                'users_id' => $request->users_id,
                'status' => $request->status,
                'module_id' => $request->modules[0] // Use first module for the edited record
            ]);
            
            // If there are additional modules selected, create new settings for them
            if (count($request->modules) > 1) {
                for ($i = 1; $i < count($request->modules); $i++) {
                    $moduleId = $request->modules[$i];
                    
                    // Check if setting already exists
                    $existing = notification_settings::where('users_id', $request->users_id)
                        ->where('module_id', $moduleId)
                        ->where('id', '!=', $id)
                        ->first();
                    
                    if (!$existing) {
                        notification_settings::create([
                            'users_id' => $request->users_id,
                            'status' => $request->status,
                            'module_id' => $moduleId
                        ]);
                    }
                }
            }
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Notification setting updated successfully',
                'setting' => $setting->load(['user', 'module'])
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Error updating notification setting: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $setting = notification_settings::findOrFail($id);
            $setting->delete();

            return response()->json([
                'success' => true,
                'message' => 'Notification setting deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting notification setting: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getUserRole($userId)
    {
        try {
            $user = User::findOrFail($userId);
            
            return response()->json([
                'success' => true,
                'role' => $user->role
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }
    }
}

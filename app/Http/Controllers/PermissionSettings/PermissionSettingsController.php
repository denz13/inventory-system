<?php

namespace App\Http\Controllers\PermissionSettings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\permission_settings;
use App\Models\permission_settings_list;
use App\Models\User;
use App\Models\module;
use Illuminate\Support\Facades\DB;

class PermissionSettingsController extends Controller
{
    public function index(Request $request)
    {
        // Get per_page from request, default to 10
        $perPage = $request->input('per_page', 10);
        
        // Start with base query
        $query = permission_settings::with(['user', 'permissionSettingsList.module']);
        
        // Apply search filter - searches user name, email
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('user', function($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                             ->orWhere('email', 'like', "%{$search}%");
                });
            });
        }
        
        // Apply status filter
        if ($request->has('status') && $request->status != '' && $request->status != 'all') {
            $query->where('status', $request->status);
        }
        
        // Apply module filter
        if ($request->has('module_filter') && $request->module_filter != '' && $request->module_filter != 'all') {
            $query->whereHas('permissionSettingsList', function($permQuery) use ($request) {
                $permQuery->where('module_id', $request->module_filter);
            });
        }
        
        // Order and paginate
        $permissionSettings = $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->appends($request->except('page'));
        
        $users = User::where('active', 1)->orderBy('name')->get();
        $modules = module::where('status', 'active')->orderBy('module_name')->get();
        
        return view('permission_settings.permission_settings', compact('permissionSettings', 'users', 'modules'));
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'users_id' => 'required|exists:users,id',
                'status' => 'required|in:active,inactive',
                'permissions' => 'required|array|min:1',
                'permissions.*' => 'required|exists:module,id'
            ]);

            DB::beginTransaction();

            // Create permission setting
            $permissionSetting = permission_settings::create([
                'users_id' => $request->users_id,
                'status' => $request->status
            ]);

            // Create permission settings list entries
            foreach ($request->permissions as $moduleId) {
                $module = module::find($moduleId);
                if ($module) {
                    permission_settings_list::create([
                        'permission_settings_id' => $permissionSetting->id,
                        'permission_allowed' => $module->module_name,
                        'module_id' => $moduleId,
                        'status' => 'active'
                    ]);
                }
            }

            DB::commit();

            $permissionSetting->load(['user', 'permissionSettingsList.module']);

            return response()->json([
                'success' => true,
                'message' => 'Permission setting created successfully',
                'setting' => $permissionSetting
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create permission setting: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $permissionSetting = permission_settings::with(['user', 'permissionSettingsList.module'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'setting' => $permissionSetting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Permission setting not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'users_id' => 'required|exists:users,id',
                'status' => 'required|in:active,inactive',
                'permissions' => 'required|array|min:1',
                'permissions.*' => 'required|exists:module,id'
            ]);

            DB::beginTransaction();

            $permissionSetting = permission_settings::findOrFail($id);

            // Update permission setting
            $permissionSetting->update([
                'users_id' => $request->users_id,
                'status' => $request->status
            ]);

            // Delete existing permission settings list entries
            $permissionSetting->permissionSettingsList()->delete();

            // Create new permission settings list entries
            foreach ($request->permissions as $moduleId) {
                $module = module::find($moduleId);
                if ($module) {
                    permission_settings_list::create([
                        'permission_settings_id' => $permissionSetting->id,
                        'permission_allowed' => $module->module_name,
                        'module_id' => $moduleId,
                        'status' => 'active'
                    ]);
                }
            }

            DB::commit();

            $permissionSetting->load(['user', 'permissionSettingsList.module']);

            return response()->json([
                'success' => true,
                'message' => 'Permission setting updated successfully',
                'setting' => $permissionSetting
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update permission setting: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $permissionSetting = permission_settings::findOrFail($id);
            
            // Delete related permission settings list entries
            $permissionSetting->permissionSettingsList()->delete();
            
            // Delete the permission setting
            $permissionSetting->delete();

            return response()->json([
                'success' => true,
                'message' => 'Permission setting deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete permission setting: ' . $e->getMessage()
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

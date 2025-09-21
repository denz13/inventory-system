<?php

namespace App\Http\Controllers\NotificationSettings;

use App\Http\Controllers\Controller;
use App\Models\notification_settings;
use App\Models\User;
use App\Models\module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationSettingsController extends Controller
{
    public function index()
    {
        $notificationSettings = notification_settings::with(['user', 'module'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        $users = User::orderBy('name')->get();
        $modules = module::where('status', 'active')->orderBy('module_name')->get();
        
        return view('notification_settings.notification_settings', compact('notificationSettings', 'users', 'modules'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'users_id' => 'required|exists:users,id',
            'status' => 'required|in:active,inactive',
            'module_id' => 'required|exists:module,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $setting = notification_settings::create([
                'users_id' => $request->users_id,
                'status' => $request->status,
                'module_id' => $request->module_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Notification setting created successfully',
                'setting' => $setting->load(['user', 'module'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating notification setting: ' . $e->getMessage()
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
            'module_id' => 'required|exists:module,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $setting = notification_settings::findOrFail($id);
            $setting->update([
                'users_id' => $request->users_id,
                'status' => $request->status,
                'module_id' => $request->module_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Notification setting updated successfully',
                'setting' => $setting->load(['user', 'module'])
            ]);
        } catch (\Exception $e) {
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
}

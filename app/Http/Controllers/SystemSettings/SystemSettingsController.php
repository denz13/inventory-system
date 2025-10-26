<?php

namespace App\Http\Controllers\SystemSettings;

use App\Http\Controllers\Controller;
use App\Models\system_settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class SystemSettingsController extends Controller
{
    
    public function index()
    {
        $systemSettings = system_settings::where('status', 'active')->get();
        return view('system_settings.system_settings', compact('systemSettings'));
    }

    public function update(Request $request, $id)
    {
        try {
            $setting = system_settings::findOrFail($id);
            
            // Validate based on setting type
            if ($setting->type === 'image') {
                $validator = Validator::make($request->all(), [
                    'value' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120' // max 5MB
                ]);
            } else {
                $validator = Validator::make($request->all(), [
                    'value' => 'required|string|max:255'
                ]);
            }

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed: ' . $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $value = $request->value;

            // Handle image upload if type is image
            if ($setting->type === 'image' && $request->hasFile('value')) {
                // Validate file is actually an image
                $file = $request->file('value');
                
                if (!$file->isValid()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid file upload'
                    ], 422);
                }

                // Delete old image if exists
                if ($setting->value && Storage::disk('public')->exists($setting->value)) {
                    Storage::disk('public')->delete($setting->value);
                }

                // Store new image
                $filename = time() . '_' . preg_replace('/[^A-Za-z0-9\-\.]/', '_', $file->getClientOriginalName());
                $path = $file->storeAs('system_settings', $filename, 'public');
                $value = $path;
            }

            $setting->update([
                'value' => $value
            ]);

            Log::info('System setting updated', [
                'setting_id' => $setting->id,
                'key' => $setting->key,
                'type' => $setting->type,
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'System setting updated successfully',
                'setting' => $setting
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'System setting not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to update system setting', [
                'setting_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update system setting: ' . $e->getMessage()
            ], 500);
        }
    }
}

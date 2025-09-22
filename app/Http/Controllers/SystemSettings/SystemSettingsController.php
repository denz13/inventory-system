<?php

namespace App\Http\Controllers\SystemSettings;

use App\Http\Controllers\Controller;
use App\Models\system_settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SystemSettingsController extends Controller
{
    
    public function index()
    {
        $systemSettings = system_settings::where('status', 'active')->get();
        return view('system_settings.system_settings', compact('systemSettings'));
    }

    public function update(Request $request, $id)
    {
        $setting = system_settings::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'value' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $value = $request->value;

            // Handle image upload if type is image
            if ($setting->type === 'image' && $request->hasFile('value')) {
                // Delete old image if exists
                if ($setting->value && Storage::disk('public')->exists($setting->value)) {
                    Storage::disk('public')->delete($setting->value);
                }

                // Store new image
                $file = $request->file('value');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('system_settings', $filename, 'public');
                $value = $path;
            }

            $setting->update([
                'value' => $value
            ]);

            return response()->json([
                'success' => true,
                'message' => 'System setting updated successfully',
                'setting' => $setting
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update system setting: ' . $e->getMessage()
            ], 500);
        }
    }
}

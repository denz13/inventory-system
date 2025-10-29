<?php

namespace App\Http\Controllers\landlord_permission;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\applied_landlord;
use App\Models\landlord_permission;
use Illuminate\Support\Facades\Log;

class LandlordPermissionController extends Controller
{
    public function index(Request $request)
    {
        // Get per_page from request, default to 10
        $perPage = $request->input('per_page', 10);
        
        // Start with base query
        $query = applied_landlord::with('user')
            ->where('status', 'approved');
        
        // Apply search filter - searches across multiple fields
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%")
                  ->orWhere('property_name', 'like', "%{$search}%")
                  ->orWhere('unit_number', 'like', "%{$search}%")
                  ->orWhere('unit_type', 'like', "%{$search}%")
                  ->orWhere('nationality', 'like', "%{$search}%")
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        // Order and paginate
        $approvedLandlords = $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->appends($request->except('page'));

        return view('landlord_permission.landlord_permission', compact('approvedLandlords'));
    }

    public function show($id)
    {
        try {
            $landlord = applied_landlord::with('user')->findOrFail($id);
            
            // Only allow viewing approved landlords
            if ($landlord->status !== 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only approved landlords can be viewed'
                ], 403);
            }
            
            return response()->json([
                'success' => true,
                'data' => $landlord
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Landlord not found'
            ], 404);
        }
    }

    public function toggleTenantAccess(Request $request, $landlordId)
    {
        try {
            $landlord = applied_landlord::findOrFail($landlordId);
            
            // Check if landlord is approved
            if ($landlord->status !== 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only approved landlords can have tenant access'
                ], 403);
            }

            $validated = $request->validate([
                'enabled' => 'required|boolean'
            ]);

            $enabled = $validated['enabled'];
            
            // Find or create landlord permission record
            $permission = landlord_permission::where('applied_landlord_id', $landlordId)->first();
            
            if (!$permission) {
                // Create new permission record
                $permission = landlord_permission::create([
                    'applied_landlord_id' => $landlordId,
                    'has_have_permission' => $enabled ? 1 : 0,
                    'status' => $enabled ? 'active' : 'inactive'
                ]);

                Log::info('Landlord permission created', [
                    'landlord_id' => $landlordId,
                    'permission_id' => $permission->id,
                    'enabled' => $enabled
                ]);
            } else {
                // Update existing permission record
                $permission->update([
                    'has_have_permission' => $enabled ? 1 : 0,
                    'status' => $enabled ? 'active' : 'inactive'
                ]);

                Log::info('Landlord permission updated', [
                    'landlord_id' => $landlordId,
                    'permission_id' => $permission->id,
                    'enabled' => $enabled
                ]);
            }

            // Activity logging
            try {
                if (auth()->check()) {
                    $action = $enabled ? 'enabled' : 'disabled';
                    auth()->user()->logCustom(
                        "Tenant access {$action} for landlord: " . $landlord->full_name . 
                        " - Property: " . $landlord->property_name
                    );
                }
            } catch (\Exception $e) {
                Log::error('Error logging tenant access toggle: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => $enabled ? 'Tenant access enabled successfully' : 'Tenant access disabled successfully',
                'permission' => $permission,
                'enabled' => $enabled
            ]);

        } catch (\Exception $e) {
            Log::error('Toggle tenant access error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error toggling tenant access: ' . $e->getMessage()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\vehicle;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\vehicle_homeowners;
use App\Models\vehicle_homeowners_supporting_documents;
use App\Models\vehicle_list_details_homeowners;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = vehicle_homeowners::with(['user', 'supportingDocuments.vehicleDetails'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        // Get unique status values from the database
        $statuses = vehicle_homeowners::select('status')
            ->distinct()
            ->whereNotNull('status')
            ->pluck('status')
            ->sort()
            ->values();
            
        return view('vehicle.vehicle', compact('vehicles', 'statuses'));
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type_of_vehicle' => 'required|string|max:255',
                'plate_number' => 'required|string|max:20|unique:tbl_vehicle_list_details_homeowners,plate_number',
                'or_no' => 'required|string|max:50',
                'vehicle_model' => 'required|string|max:255',
                'cr_no' => 'required|string|max:50',
                'color_of_vehicle' => 'required|string|max:100',
                'supporting_documents_attachments' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240'
            ]);

            DB::beginTransaction();

            // Handle file upload
            $filePath = null;
            if ($request->hasFile('supporting_documents_attachments')) {
                $file = $request->file('supporting_documents_attachments');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('vehicle_documents', $fileName, 'public');
            }

            // Create vehicle homeowner record with automatic 'Pending' status
            $vehicleHomeowner = vehicle_homeowners::create([
                'user_id' => Auth::id(),
                'type_of_vehicle' => $validated['type_of_vehicle'],
                'status' => 'Pending'
            ]);

            // Create supporting documents record
            $supportingDocuments = vehicle_homeowners_supporting_documents::create([
                'vehicle_homeowners_id' => $vehicleHomeowner->id,
                'supporting_documents_attachments' => $filePath,
                'status' => 'Pending'
            ]);

            // Create vehicle details record
            $vehicleDetails = vehicle_list_details_homeowners::create([
                'vehicle_homeowners_supporting_documents_id' => $supportingDocuments->id,
                'plate_number' => $validated['plate_number'],
                'or_no' => $validated['or_no'],
                'vehicle_model' => $validated['vehicle_model'],
                'cr_no' => $validated['cr_no'],
                'color_of_vehicle' => $validated['color_of_vehicle'],
                'vehicle_sticker_control_no' => null, // Set to null as this field is removed
                'status' => 'Pending'
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Vehicle added successfully',
                'vehicle' => $vehicleHomeowner->load(['user', 'supportingDocuments.vehicleDetails'])
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error adding vehicle: ' . $e->getMessage(),
                'error' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function show($id)
    {
        $vehicle = vehicle_homeowners::with(['user', 'supportingDocuments.vehicleDetails'])
            ->findOrFail($id);
            
        return response()->json([
            'data' => $vehicle
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $vehicle = vehicle_homeowners::findOrFail($id);
            
            $validated = $request->validate([
                'type_of_vehicle' => 'required|string|max:255',
                'plate_number' => 'required|string|max:20|unique:tbl_vehicle_list_details_homeowners,plate_number,' . $id,
                'or_no' => 'required|string|max:50',
                'vehicle_model' => 'required|string|max:255',
                'cr_no' => 'required|string|max:50',
                'color_of_vehicle' => 'required|string|max:100',
                'supporting_documents_attachments' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240'
            ]);

            DB::beginTransaction();

            $vehicle->update([
                'type_of_vehicle' => $validated['type_of_vehicle'],
                'status' => 'Pending' // Keep as Pending
            ]);

            if ($vehicle->supportingDocuments) {
                // Handle file upload for update
                $filePath = $vehicle->supportingDocuments->supporting_documents_attachments;
                if ($request->hasFile('supporting_documents_attachments')) {
                    // Delete old file if exists
                    if ($filePath && Storage::disk('public')->exists($filePath)) {
                        Storage::disk('public')->delete($filePath);
                    }
                    
                    $file = $request->file('supporting_documents_attachments');
                    $fileName = time() . '_' . $file->getClientOriginalName();
                    $filePath = $file->storeAs('vehicle_documents', $fileName, 'public');
                }

                $vehicle->supportingDocuments->update([
                    'supporting_documents_attachments' => $filePath,
                    'status' => 'Pending'
                ]);

                if ($vehicle->supportingDocuments->vehicleDetails) {
                    $vehicle->supportingDocuments->vehicleDetails->update([
                        'plate_number' => $validated['plate_number'],
                        'or_no' => $validated['or_no'],
                        'vehicle_model' => $validated['vehicle_model'],
                        'cr_no' => $validated['cr_no'],
                        'color_of_vehicle' => $validated['color_of_vehicle'],
                        'vehicle_sticker_control_no' => null, // Keep as null
                        'status' => 'Pending'
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Vehicle updated successfully',
                'vehicle' => $vehicle->load(['user', 'supportingDocuments.vehicleDetails'])
            ]);
            
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error updating vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            
            $vehicle = vehicle_homeowners::findOrFail($id);
            
            // Soft delete the vehicle and all related records
            if ($vehicle->supportingDocuments) {
                // Soft delete vehicle details first
                if ($vehicle->supportingDocuments->vehicleDetails) {
                    $vehicle->supportingDocuments->vehicleDetails->delete();
                }
                
                // Soft delete supporting documents
                $vehicle->supportingDocuments->delete();
            }
            
            // Finally, soft delete the main vehicle record
            $vehicle->delete();
            
            DB::commit();

            return response()->json([
                'message' => 'Vehicle deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error deleting vehicle: ' . $e->getMessage()
            ], 500);
        }
    }



    public function restore($id)
    {
        try {
            DB::beginTransaction();
            
            $vehicle = vehicle_homeowners::withTrashed()->findOrFail($id);
            
            // Restore the main vehicle record
            $vehicle->restore();
            
            // Restore related records if they exist
            if ($vehicle->supportingDocuments) {
                $vehicle->supportingDocuments->restore();
                
                if ($vehicle->supportingDocuments->vehicleDetails) {
                    $vehicle->supportingDocuments->vehicleDetails->restore();
                }
            }
            
            DB::commit();

            return response()->json([
                'message' => 'Vehicle restored successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error restoring vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

    public function forceDelete($id)
    {
        try {
            DB::beginTransaction();
            
            $vehicle = vehicle_homeowners::withTrashed()->findOrFail($id);
            
            // Delete associated files before force deleting
            if ($vehicle->supportingDocuments && $vehicle->supportingDocuments->supporting_documents_attachments) {
                $filePath = $vehicle->supportingDocuments->supporting_documents_attachments;
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }
            }
            
            // Force delete related records first
            if ($vehicle->supportingDocuments) {
                if ($vehicle->supportingDocuments->vehicleDetails) {
                    $vehicle->supportingDocuments->vehicleDetails->forceDelete();
                }
                $vehicle->supportingDocuments->forceDelete();
            }
            
            // Finally, force delete the main vehicle record
            $vehicle->forceDelete();
            
            DB::commit();

            return response()->json([
                'message' => 'Vehicle permanently deleted'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error permanently deleting vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

    public function trash()
    {
        $deletedVehicles = vehicle_homeowners::with(['user', 'supportingDocuments.vehicleDetails'])
            ->onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->paginate(10);

        return view('vehicle.trash', compact('deletedVehicles'));
    }
}

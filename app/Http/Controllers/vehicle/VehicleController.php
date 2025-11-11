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
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        
        $vehicles = vehicle_homeowners::with(['user', 'supportingDocuments.vehicleDetails'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
            
        // Get unique status values from the database for current user only
        $statuses = vehicle_homeowners::select('status')
            ->where('user_id', Auth::id())
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
                'owner' => 'required|string|max:255',
                'driver' => 'required|string|max:255',
                'supporting_documents_attachments.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240'
            ]);

            DB::beginTransaction();

            // Handle multiple file uploads
            $filePaths = [];
            if ($request->hasFile('supporting_documents_attachments')) {
                foreach ($request->file('supporting_documents_attachments') as $file) {
                    $fileName = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                    $filePath = $file->storeAs('vehicle_documents', $fileName, 'public');
                    $filePaths[] = $filePath;
                }
            }

            // Create vehicle homeowner record with automatic 'Pending' status
            $vehicleHomeowner = vehicle_homeowners::create([
                'user_id' => Auth::id(),
                'type_of_vehicle' => $validated['type_of_vehicle'],
                'status' => 'Pending'
            ]);

            // Create supporting documents record - store as JSON array
            $supportingDocuments = vehicle_homeowners_supporting_documents::create([
                'vehicle_homeowners_id' => $vehicleHomeowner->id,
                'supporting_documents_attachments' => !empty($filePaths) ? json_encode($filePaths) : null,
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
                'owner' => $validated['owner'],
                'driver' => $validated['driver'],
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
            ->where('user_id', Auth::id())
            ->findOrFail($id);
            
        return response()->json([
            'data' => $vehicle
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $vehicle = vehicle_homeowners::where('user_id', Auth::id())
                ->findOrFail($id);
            
            // Get current vehicle details ID for unique validation
            $vehicleDetailsId = $vehicle->supportingDocuments?->vehicleDetails?->id;
            
            $validated = $request->validate([
                'type_of_vehicle' => 'nullable|string|max:255',
                'plate_number' => 'nullable|string|max:20|unique:tbl_vehicle_list_details_homeowners,plate_number,' . $vehicleDetailsId,
                'or_no' => 'nullable|string|max:50',
                'vehicle_model' => 'nullable|string|max:255',
                'cr_no' => 'nullable|string|max:50',
                'color_of_vehicle' => 'nullable|string|max:100',
                'owner' => 'nullable|string|max:255',
                'driver' => 'nullable|string|max:255',
                'supporting_documents_attachments.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240'
            ]);

            DB::beginTransaction();

            // Check if any fields are being updated (excluding empty file inputs)
            $hasUpdates = $request->filled('type_of_vehicle') 
                || $request->filled('plate_number')
                || $request->filled('or_no')
                || $request->filled('vehicle_model')
                || $request->filled('cr_no')
                || $request->filled('color_of_vehicle')
                || $request->filled('owner')
                || $request->filled('driver')
                || $request->hasFile('supporting_documents_attachments');

            // Only update vehicle type if provided
            $vehicleUpdates = [];
            if ($request->filled('type_of_vehicle')) {
                $vehicleUpdates['type_of_vehicle'] = $validated['type_of_vehicle'];
            }
            
            // Reset status to 'Pending' if any update is made
            if ($hasUpdates) {
                $vehicleUpdates['status'] = 'Pending';
            }
            
            if (!empty($vehicleUpdates)) {
                $vehicle->update($vehicleUpdates);
            }

            if ($vehicle->supportingDocuments) {
                // Reset status to 'Pending' if any update is made
                $supportingDocsUpdates = [];
                if ($hasUpdates) {
                    $supportingDocsUpdates['status'] = 'Pending';
                }
                
                // Get existing files
                $existingFiles = $vehicle->supportingDocuments->supporting_documents_attachments;
                $existingFilePaths = $existingFiles ? json_decode($existingFiles, true) : [];
                
                // If not an array, convert to array (backward compatibility)
                if (!is_array($existingFilePaths)) {
                    $existingFilePaths = $existingFiles ? [$existingFiles] : [];
                }
                
                // Handle multiple file uploads for update - only if new files provided
                if ($request->hasFile('supporting_documents_attachments')) {
                    // Delete old files
                    foreach ($existingFilePaths as $oldFile) {
                        if ($oldFile && Storage::disk('public')->exists($oldFile)) {
                            Storage::disk('public')->delete($oldFile);
                        }
                    }
                    
                    // Upload new files
                    $newFilePaths = [];
                    foreach ($request->file('supporting_documents_attachments') as $file) {
                        $fileName = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                        $filePath = $file->storeAs('vehicle_documents', $fileName, 'public');
                        $newFilePaths[] = $filePath;
                    }
                    
                    // Update supporting documents with new files
                    $supportingDocsUpdates['supporting_documents_attachments'] = !empty($newFilePaths) ? json_encode($newFilePaths) : null;
                }
                
                // Update supporting documents if there are any changes
                if (!empty($supportingDocsUpdates)) {
                    $vehicle->supportingDocuments->update($supportingDocsUpdates);
                }

                // Update vehicle details - only fields that are provided
                if ($vehicle->supportingDocuments->vehicleDetails) {
                    $detailsUpdates = [];
                    
                    if ($request->filled('plate_number')) {
                        $detailsUpdates['plate_number'] = $validated['plate_number'];
                    }
                    if ($request->filled('or_no')) {
                        $detailsUpdates['or_no'] = $validated['or_no'];
                    }
                    if ($request->filled('vehicle_model')) {
                        $detailsUpdates['vehicle_model'] = $validated['vehicle_model'];
                    }
                    if ($request->filled('cr_no')) {
                        $detailsUpdates['cr_no'] = $validated['cr_no'];
                    }
                    if ($request->filled('color_of_vehicle')) {
                        $detailsUpdates['color_of_vehicle'] = $validated['color_of_vehicle'];
                    }
                    if ($request->filled('owner')) {
                        $detailsUpdates['owner'] = $validated['owner'];
                    }
                    if ($request->filled('driver')) {
                        $detailsUpdates['driver'] = $validated['driver'];
                    }
                    
                    // Reset status to 'Pending' if any update is made
                    if ($hasUpdates) {
                        $detailsUpdates['status'] = 'Pending';
                    }
                    
                    // Always update if there are status changes or field updates
                    if (!empty($detailsUpdates) || $hasUpdates) {
                        $vehicle->supportingDocuments->vehicleDetails->update($detailsUpdates);
                    }
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
            
            $vehicle = vehicle_homeowners::where('user_id', Auth::id())
                ->findOrFail($id);
            
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
            
            $vehicle = vehicle_homeowners::withTrashed()
                ->where('user_id', Auth::id())
                ->findOrFail($id);
            
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
            
            $vehicle = vehicle_homeowners::withTrashed()
                ->where('user_id', Auth::id())
                ->findOrFail($id);
            
            // Delete associated files before force deleting
            if ($vehicle->supportingDocuments && $vehicle->supportingDocuments->supporting_documents_attachments) {
                $filesData = $vehicle->supportingDocuments->supporting_documents_attachments;
                
                // Try to decode as JSON array (multiple files)
                $files = json_decode($filesData, true);
                if (is_array($files)) {
                    // Multiple files
                    foreach ($files as $filePath) {
                        if ($filePath && Storage::disk('public')->exists($filePath)) {
                            Storage::disk('public')->delete($filePath);
                        }
                    }
                } else {
                    // Single file (backward compatibility)
                    if ($filesData && Storage::disk('public')->exists($filesData)) {
                        Storage::disk('public')->delete($filesData);
                    }
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

    public function trash(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        
        $deletedVehicles = vehicle_homeowners::with(['user', 'supportingDocuments.vehicleDetails'])
            ->where('user_id', Auth::id())
            ->onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->paginate($perPage);

        return view('vehicle.trash', compact('deletedVehicles'));
    }
}

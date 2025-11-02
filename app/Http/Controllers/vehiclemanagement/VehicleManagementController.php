<?php

namespace App\Http\Controllers\vehiclemanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\vehicle_homeowners;
use App\Models\vehicle_homeowners_supporting_documents;
use App\Models\vehicle_list_details_homeowners;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class VehicleManagementController extends Controller
{
    public function index(Request $request)
    {
        // Build query for vehicles
        $query = vehicle_homeowners::with(['user', 'supportingDocuments.vehicleDetails.stickerControl']);
        
        // Apply search filter
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('type_of_vehicle', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('supportingDocuments.vehicleDetails', function($q) use ($search) {
                      $q->where('owner', 'like', "%{$search}%")
                        ->orWhere('driver', 'like', "%{$search}%")
                        ->orWhere('plate_number', 'like', "%{$search}%")
                        ->orWhere('vehicle_model', 'like', "%{$search}%")
                        ->orWhere('color_of_vehicle', 'like', "%{$search}%");
                  });
            });
        }
        
        $perPage = $request->input('per_page', 10);
        $vehicles = $query->latest()->paginate($perPage);
        
        // Get unique statuses for filter
        $statuses = vehicle_homeowners::distinct()
            ->pluck('status')
            ->filter()
            ->sort()
            ->values();
            
        return view('vehiclemanagement.vehiclemanagement', compact('vehicles', 'statuses'));
    }

    public function show($id)
    {
        $vehicle = vehicle_homeowners::with(['user', 'supportingDocuments.vehicleDetails.stickerControl'])->findOrFail($id);
        
        return response()->json([
            'vehicle' => $vehicle,
            'supporting_documents' => $vehicle->supportingDocuments,
            'vehicle_details' => $vehicle->supportingDocuments?->vehicleDetails
        ]);
    }

    public function approve($id)
    {
        try {
            DB::beginTransaction();
            
            $vehicle = vehicle_homeowners::findOrFail($id);
            $vehicle->status = 'Approved';
            $vehicle->save();
            
            // Update status in vehicle_homeowners_supporting_documents table
            if ($vehicle->supportingDocuments) {
                $vehicle->supportingDocuments->status = 'Approved';
                $vehicle->supportingDocuments->save();
            }
            
            // Update status in vehicle_list_details_homeowners table
            if ($vehicle->supportingDocuments && $vehicle->supportingDocuments->vehicleDetails) {
                // Generate control number
                $controlNumber = $this->generateControlNumber();
                
                // Create sticker control number record first
                $stickerControl = \App\Models\sticker_control_number::create([
                    'vehicle_list_details_homeowners_id' => $vehicle->supportingDocuments->vehicleDetails->id,
                    'control_number' => $controlNumber,
                    'status' => 'Active'
                ]);
                
                // Update vehicle details with status and sticker control ID
                $vehicle->supportingDocuments->vehicleDetails->status = 'Approved';
                $vehicle->supportingDocuments->vehicleDetails->vehicle_sticker_control_no = $stickerControl->id;
                $vehicle->supportingDocuments->vehicleDetails->save();
            }
            
            DB::commit();
            
            return response()->json([
                'message' => 'Vehicle approved successfully. Please set the validity date.',
                'vehicle' => $vehicle->fresh(),
                'control_number' => $controlNumber ?? null,
                'sticker_id' => $stickerControl->id ?? null
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error approving vehicle: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error approving vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

    private function generateControlNumber()
    {
        // Generate a unique control number (you can customize this format)
        $prefix = 'SCN';
        $year = date('Y');
        $random = str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        
        return $prefix . $year . $random;
    }

    public function updateValidUntil(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'valid_until' => 'required|date|after:today',
            ]);
            
            $stickerControl = \App\Models\sticker_control_number::findOrFail($id);
            $stickerControl->valid_until = $validated['valid_until'];
            $stickerControl->save();
            
            return response()->json([
                'message' => 'Validity date set successfully',
                'sticker_control' => $stickerControl
            ]);
        } catch (\Exception $e) {
            Log::error('Error setting validity date: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error setting validity date: ' . $e->getMessage()
            ], 500);
        }
    }

    public function decline(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'reason' => 'required|string|max:1000',
            ]);
            
            $vehicle = vehicle_homeowners::findOrFail($id);
            $vehicle->status = 'Declined';
            $vehicle->save();
            
            // Update status in vehicle_homeowners_supporting_documents table
            if ($vehicle->supportingDocuments) {
                $vehicle->supportingDocuments->status = 'Declined';
                $vehicle->supportingDocuments->save();
            }
            
            // Update status and store reason in vehicle_list_details_homeowners table
            if ($vehicle->supportingDocuments && $vehicle->supportingDocuments->vehicleDetails) {
                $vehicle->supportingDocuments->vehicleDetails->status = 'Declined';
                $vehicle->supportingDocuments->vehicleDetails->reason = $validated['reason'];
                $vehicle->supportingDocuments->vehicleDetails->save();
            }
            
            return response()->json([
                'message' => 'Vehicle declined successfully',
                'vehicle' => $vehicle->fresh()
            ]);
        } catch (\Exception $e) {
            Log::error('Error declining vehicle: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error declining vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type_of_vehicle' => ['required', 'string', 'max:255'],
                'status' => ['required', Rule::in(['Pending', 'Active', 'Inactive'])],
                'owner' => ['required', 'string', 'max:255'],
                'driver' => ['required', 'string', 'max:255'],
                'plate_number' => ['required', 'string', 'max:20'],
                'or_no' => ['required', 'string', 'max:50'],
                'vehicle_model' => ['required', 'string', 'max:255'],
                'cr_no' => ['required', 'string', 'max:50'],
                'color_of_vehicle' => ['required', 'string', 'max:100'],
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

            // Create vehicle homeowner record
            $vehicleHomeowner = vehicle_homeowners::create([
                'user_id' => auth()->id(), // Use logged in user
                'type_of_vehicle' => $validated['type_of_vehicle'],
                'status' => $validated['status']
            ]);

            // Create supporting documents record - store as JSON array
            $supportingDocuments = vehicle_homeowners_supporting_documents::create([
                'vehicle_homeowners_id' => $vehicleHomeowner->id,
                'supporting_documents_attachments' => !empty($filePaths) ? json_encode($filePaths) : null,
                'status' => $validated['status']
            ]);

            // Create vehicle details record
            vehicle_list_details_homeowners::create([
                'vehicle_homeowners_supporting_documents_id' => $supportingDocuments->id,
                'owner' => $validated['owner'],
                'driver' => $validated['driver'],
                'plate_number' => $validated['plate_number'],
                'or_no' => $validated['or_no'],
                'vehicle_model' => $validated['vehicle_model'],
                'cr_no' => $validated['cr_no'],
                'color_of_vehicle' => $validated['color_of_vehicle'],
                'vehicle_sticker_control_no' => null,
                'status' => $validated['status']
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Vehicle saved successfully',
                'id' => $vehicleHomeowner->id
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error saving vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $vehicle = vehicle_homeowners::findOrFail($id);
            
            $validated = $request->validate([
                'type_of_vehicle' => ['required', 'string', 'max:255'],
                'status' => ['required', Rule::in(['Pending', 'Active', 'Inactive'])],
                'owner' => ['required', 'string', 'max:255'],
                'driver' => ['required', 'string', 'max:255'],
                'plate_number' => ['required', 'string', 'max:20'],
                'or_no' => ['required', 'string', 'max:50'],
                'vehicle_model' => ['required', 'string', 'max:255'],
                'cr_no' => ['required', 'string', 'max:50'],
                'color_of_vehicle' => ['required', 'string', 'max:100'],
                'supporting_documents_attachments.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240'
            ]);

            DB::beginTransaction();

            $vehicle->update([
                'type_of_vehicle' => $validated['type_of_vehicle'],
                'status' => $validated['status']
            ]);

            if ($vehicle->supportingDocuments) {
                // Get existing files
                $existingFiles = $vehicle->supportingDocuments->supporting_documents_attachments;
                $existingFilePaths = $existingFiles ? json_decode($existingFiles, true) : [];
                
                // If not an array, convert to array (backward compatibility)
                if (!is_array($existingFilePaths)) {
                    $existingFilePaths = $existingFiles ? [$existingFiles] : [];
                }
                
                // Handle multiple file uploads for update
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
                    
                    $existingFilePaths = $newFilePaths;
                }

                $vehicle->supportingDocuments->update([
                    'supporting_documents_attachments' => !empty($existingFilePaths) ? json_encode($existingFilePaths) : null,
                    'status' => $validated['status']
                ]);

                if ($vehicle->supportingDocuments->vehicleDetails) {
                    $vehicle->supportingDocuments->vehicleDetails->update([
                        'owner' => $validated['owner'],
                        'driver' => $validated['driver'],
                        'plate_number' => $validated['plate_number'],
                        'or_no' => $validated['or_no'],
                        'vehicle_model' => $validated['vehicle_model'],
                        'cr_no' => $validated['cr_no'],
                        'color_of_vehicle' => $validated['color_of_vehicle'],
                        'vehicle_sticker_control_no' => null,
                        'status' => $validated['status']
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Vehicle updated successfully'
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
}

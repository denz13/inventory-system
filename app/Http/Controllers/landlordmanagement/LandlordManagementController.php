<?php

namespace App\Http\Controllers\landlordmanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\applied_landlord;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class LandlordManagementController extends Controller
{
    public function index(Request $request)
    {
        // Get per_page from request, default to 10
        $perPage = $request->input('per_page', 10);
        
        // Start query with user relationship
        $query = applied_landlord::with('user');
        
        // Search functionality
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'LIKE', "%{$search}%")
                  ->orWhere('last_name', 'LIKE', "%{$search}%")
                  ->orWhere('middle_initial', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('phone_number', 'LIKE', "%{$search}%")
                  ->orWhere('property_name', 'LIKE', "%{$search}%")
                  ->orWhere('unit_number', 'LIKE', "%{$search}%")
                  ->orWhere('unit_type', 'LIKE', "%{$search}%")
                  ->orWhere('nationality', 'LIKE', "%{$search}%");
            });
        }
        
        // Status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Order by creation date
        $query->orderBy('created_at', 'desc');
        
        // Paginate results and append query parameters
        $landlords = $query->paginate($perPage)->appends($request->except('page'));

        return view('landlord-management.landlord-management', compact('landlords'));
    }

    public function show($id)
    {
        try {
            $landlord = applied_landlord::with('user')->findOrFail($id);
            
            // Get tenants for this landlord (tenants with same user_id as landlord's submitted_by)
            $tenants = \App\Models\tbl_tenant_list::where('user_id', $landlord->submitted_by)
                ->orderBy('created_at', 'desc')
                ->get();
            
            // Add tenants to landlord data
            $landlord->tenants = $tenants;
            
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

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'middle_initial' => 'nullable|string|max:10',
                'date_of_birth' => 'required|date',
                'address' => 'required|string|max:500',
                'civil_status' => 'required|string|max:255',
                'nationality' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone_number' => 'required|string|max:255',
                'years_of_residency' => 'required|integer|min:0',
                'property_name' => 'required|string|max:255',
                'unit_number' => 'required|string|max:255',
                'property_address' => 'required|string|max:500',
                'unit_type' => 'required|string|max:255',
                'floor_area' => 'required|numeric|min:0',
                'unit_condition' => 'required|string|max:255',
                'unit_condition_optional' => 'nullable|string|max:500',
                'supporting_documents' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            ]);

            $filePath = null;
            if ($request->hasFile('supporting_documents')) {
                $file = $request->file('supporting_documents');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('landlord_documents', $fileName, 'public');
            }

            $landlord = applied_landlord::create([
                'submitted_by' => auth()->id(),
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'middle_initial' => $validated['middle_initial'],
                'date_of_birth' => $validated['date_of_birth'],
                'address' => $validated['address'],
                'civil_status' => $validated['civil_status'],
                'nationality' => $validated['nationality'],
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'],
                'years_of_residency' => $validated['years_of_residency'],
                'property_name' => $validated['property_name'],
                'unit_number' => $validated['unit_number'],
                'property_address' => $validated['property_address'],
                'unit_type' => $validated['unit_type'],
                'floor_area' => $validated['floor_area'],
                'unit_condition' => $validated['unit_condition'],
                'unit_condition_optional' => $validated['unit_condition_optional'],
                'supporting_documents' => $filePath,
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Landlord registered successfully',
                'landlord' => $landlord->load('user')
            ]);

        } catch (\Exception $e) {
            Log::error('Landlord registration error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error registering landlord: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $landlord = applied_landlord::findOrFail($id);

            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'middle_initial' => 'nullable|string|max:10',
                'date_of_birth' => 'required|date',
                'address' => 'required|string|max:500',
                'civil_status' => 'required|string|max:255',
                'nationality' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone_number' => 'required|string|max:255',
                'years_of_residency' => 'required|integer|min:0',
                'property_name' => 'required|string|max:255',
                'unit_number' => 'required|string|max:255',
                'property_address' => 'required|string|max:500',
                'unit_type' => 'required|string|max:255',
                'floor_area' => 'required|numeric|min:0',
                'unit_condition' => 'required|string|max:255',
                'unit_condition_optional' => 'nullable|string|max:500',
                'supporting_documents' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            ]);

            // Handle file upload
            if ($request->hasFile('supporting_documents')) {
                // Delete old file if exists
                if ($landlord->supporting_documents && Storage::disk('public')->exists($landlord->supporting_documents)) {
                    Storage::disk('public')->delete($landlord->supporting_documents);
                }
                
                $file = $request->file('supporting_documents');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('landlord_documents', $fileName, 'public');
                $validated['supporting_documents'] = $filePath;
            }

            $landlord->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Landlord updated successfully',
                'landlord' => $landlord->fresh()->load('user')
            ]);

        } catch (\Exception $e) {
            Log::error('Landlord update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating landlord: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $landlord = applied_landlord::findOrFail($id);
            
            // Delete file if exists
            if ($landlord->supporting_documents && Storage::disk('public')->exists($landlord->supporting_documents)) {
                Storage::disk('public')->delete($landlord->supporting_documents);
            }
            
            $landlord->delete();

            return response()->json([
                'success' => true,
                'message' => 'Landlord deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Landlord delete error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting landlord'
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $landlord = applied_landlord::findOrFail($id);

            $validated = $request->validate([
                'status' => 'required|in:pending,approved,declined',
                'reason' => 'nullable|string|max:1000'
            ]);

            $landlord->update([
                'status' => $validated['status'],
                'reason' => $validated['reason']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Landlord status updated successfully',
                'landlord' => $landlord->fresh()->load('user')
            ]);

        } catch (\Exception $e) {
            Log::error('Landlord status update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating landlord status: ' . $e->getMessage()
            ], 500);
        }
    }

    public function approve(Request $request, $id)
    {
        try {
            $landlord = applied_landlord::with('user')->findOrFail($id);
            
            // Validate file upload
            $validated = $request->validate([
                'business_clearance_attachments' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // max 10MB
            ]);

            // Handle file upload
            $filePath = null;
            if ($request->hasFile('business_clearance_attachments')) {
                $file = $request->file('business_clearance_attachments');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('business_clearance_attachments', $fileName, 'public');
                
                Log::info('Business clearance file uploaded', [
                    'landlord_id' => $landlord->id,
                    'file_path' => $filePath,
                    'file_name' => $fileName
                ]);
            }
            
            // Update status to approved and save business clearance attachment
            $landlord->update([
                'status' => 'approved',
                'reason' => null, // Clear any previous rejection reason
                'business_clearance_attachments' => $filePath
            ]);

            // Activity logging for landlord approval
            try {
                if (auth()->check()) {
                    auth()->user()->logCustom(
                        "Approved landlord application for " . $landlord->full_name . 
                        " - Property: " . $landlord->property_name . 
                        " - Unit: " . $landlord->unit_number .
                        " - Business clearance uploaded"
                    );
                    Log::info('Landlord approval activity logged successfully', [
                        'user_id' => auth()->id(),
                        'landlord_id' => $landlord->id,
                        'clearance_file' => $filePath
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Error logging landlord approval activity: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Landlord application approved successfully with business clearance uploaded'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Landlord approval validation error: ' . json_encode($e->errors()));
            return response()->json([
                'success' => false,
                'message' => 'Validation error: ' . implode(', ', array_map(fn($errors) => implode(', ', $errors), $e->errors()))
            ], 422);
        } catch (\Exception $e) {
            Log::error('Landlord approval error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve landlord application: ' . $e->getMessage()
            ], 500);
        }
    }

    public function decline(Request $request, $id)
    {
        try {
            $landlord = applied_landlord::with('user')->findOrFail($id);
            
            // Get rejection reason from request
            $reason = $request->input('reason', '');
            
            if (empty($reason)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reason for decline is required'
                ], 400);
            }
            
            // Update status to declined and save reason
            $landlord->update([
                'status' => 'declined',
                'reason' => $reason
            ]);

            // Activity logging for landlord decline
            try {
                if (auth()->check()) {
                    $logMessage = "Declined landlord application for " . $landlord->full_name . 
                        " - Property: " . $landlord->property_name . 
                        " - Unit: " . $landlord->unit_number;
                    
                    if ($reason) {
                        $logMessage .= " - Reason: " . $reason;
                    }
                    
                    auth()->user()->logCustom($logMessage);
                    Log::info('Landlord decline activity logged successfully', [
                        'user_id' => auth()->id(),
                        'landlord_id' => $landlord->id
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Error logging landlord decline activity: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Landlord application declined successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Landlord decline error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to decline landlord application'
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\landlord;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\applied_landlord;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class LandlordController extends Controller
{
    public function index(Request $request)
    {
        $query = applied_landlord::with('user')
            ->where('submitted_by', auth()->id());
        
        // Apply search filter - comprehensive search across all fields
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                // Personal Information fields
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('middle_initial', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%")
                  ->orWhere('nationality', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('civil_status', 'like', "%{$search}%")
                  // Property Information fields
                  ->orWhere('property_name', 'like', "%{$search}%")
                  ->orWhere('unit_number', 'like', "%{$search}%")
                  ->orWhere('property_address', 'like', "%{$search}%")
                  ->orWhere('unit_type', 'like', "%{$search}%")
                  ->orWhere('unit_condition', 'like', "%{$search}%")
                  ->orWhere('unit_condition_optional', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%")
                  // Search by submitted user name
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        // Apply status filter
        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }
        
        $perPage = $request->input('per_page', 10);
        $landlords = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        return view('landlord.landlord', compact('landlords'));
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                // Personal Information
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'middle_initial' => 'nullable|string|max:10',
                'date_of_birth' => 'required|date',
                'address' => 'required|string|max:500',
                'civil_status' => 'required|string|in:Single,Married,Widowed,Separated,Divorced',
                'nationality' => 'required|string|max:100',
                'email' => 'required|email|max:255',
                'phone_number' => 'required|string|max:20',
                'years_of_residency' => 'required|integer|min:0',
                
                // Property Information
                'property_name' => 'required|string|max:255',
                'unit_number' => 'required|string|max:100',
                'property_address' => 'required|string|max:500',
                'unit_type' => 'required|string|max:100',
                'floor_area' => 'required|numeric|min:0',
                'unit_condition' => 'required|string|in:Fully Furnished,Semi-Furnished,Unfurnished',
                'unit_condition_optional' => 'nullable|string|max:255',
                
                // File upload - multiple files
                'supporting_documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240', // 10MB max per file
            ]);

            // Handle multiple file uploads
            $filePaths = [];
            if ($request->hasFile('supporting_documents')) {
                foreach ($request->file('supporting_documents') as $index => $file) {
                    $fileName = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('landlord_documents', $fileName, 'public');
                    $filePaths[] = $path;
                }
            }
            
            // Convert array to JSON string for storage
            $filePathsJson = !empty($filePaths) ? json_encode($filePaths) : null;

            $landlord = applied_landlord::create([
                'submitted_by' => auth()->id(), // Current logged in user
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
                'supporting_documents' => $filePathsJson,
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Landlord registered successfully',
                'landlord' => $landlord->load('user')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error registering landlord: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            // Only show if it belongs to the current user
            $landlord = applied_landlord::with('user')
                ->where('id', $id)
                ->where('submitted_by', auth()->id())
                ->firstOrFail();
            
            return response()->json([
                'success' => true,
                'data' => $landlord
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Landlord not found or you do not have permission to view it'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Only allow update if it belongs to the current user
            $landlord = applied_landlord::where('id', $id)
                ->where('submitted_by', auth()->id())
                ->firstOrFail();
            
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'middle_initial' => 'nullable|string|max:10',
                'date_of_birth' => 'required|date',
                'address' => 'required|string|max:500',
                'civil_status' => 'required|string|in:Single,Married,Widowed,Separated,Divorced',
                'nationality' => 'required|string|max:100',
                'email' => 'required|email|max:255',
                'phone_number' => 'required|string|max:20',
                'years_of_residency' => 'required|integer|min:0',
                'property_name' => 'required|string|max:255',
                'unit_number' => 'required|string|max:100',
                'property_address' => 'required|string|max:500',
                'unit_type' => 'required|string|max:100',
                'floor_area' => 'required|numeric|min:0',
                'unit_condition' => 'required|string|in:Fully Furnished,Semi-Furnished,Unfurnished',
                'unit_condition_optional' => 'nullable|string|max:255',
                'supporting_documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            ]);

            // Handle multiple file uploads
            if ($request->hasFile('supporting_documents')) {
                // Delete old files if exist
                if ($landlord->supporting_documents) {
                    $oldFiles = json_decode($landlord->supporting_documents, true);
                    if (is_array($oldFiles)) {
                        foreach ($oldFiles as $oldFile) {
                            Storage::disk('public')->delete($oldFile);
                        }
                    } else {
                        // Handle single file (old format)
                        Storage::disk('public')->delete($landlord->supporting_documents);
                    }
                }
                
                // Upload new files
                $filePaths = [];
                foreach ($request->file('supporting_documents') as $index => $file) {
                    $fileName = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('landlord_documents', $fileName, 'public');
                    $filePaths[] = $path;
                }
                
                // Store as JSON
                $validated['supporting_documents'] = json_encode($filePaths);
            }

            $landlord->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Landlord updated successfully',
                'data' => $landlord
            ]);

        } catch (\Exception $e) {
            Log::error('Landlord update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update landlord: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Only allow delete if it belongs to the current user
            $landlord = applied_landlord::where('id', $id)
                ->where('submitted_by', auth()->id())
                ->firstOrFail();
            
            // Delete files if exist
            if ($landlord->supporting_documents) {
                $files = json_decode($landlord->supporting_documents, true);
                if (is_array($files)) {
                    foreach ($files as $file) {
                        Storage::disk('public')->delete($file);
                    }
                } else {
                    // Handle single file (old format)
                    Storage::disk('public')->delete($landlord->supporting_documents);
                }
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
                'message' => 'Failed to delete landlord or you do not have permission'
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|string|in:pending,approved,declined',
                'reason' => 'nullable|string|max:500',
            ]);

            $landlord = applied_landlord::findOrFail($id);
            $landlord->update([
                'status' => $validated['status'],
                'reason' => $validated['reason'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status updated successfully',
                'data' => $landlord
            ]);

        } catch (\Exception $e) {
            Log::error('Status update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update status'
            ], 500);
        }
    }
}

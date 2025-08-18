<?php

namespace App\Http\Controllers\servicemanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_service_management_complaints;

class ServiceManagementController extends Controller
{
    public function index()
    {
        // Get per_page from request, default to 10
        $perPage = request('per_page', 10);
        
        // Get all service requests with relationships - using the correct relationship names
        $serviceRequests = tbl_service_management_complaints::with(['user', 'serviceCategory', 'serviceCategory.serviceType'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return view('service-management.service-management', compact('serviceRequests'));
    }

    public function show($id)
    {
        $request = tbl_service_management_complaints::with(['user', 'serviceCategory', 'serviceCategory.serviceType'])
            ->findOrFail($id);

        return response()->json($request);
    }

    public function approve($id)
    {
        try {
            $serviceRequest = tbl_service_management_complaints::findOrFail($id);
            $serviceRequest->status = 'Approved';
            $serviceRequest->save();
            
            return response()->json([
                'message' => 'Service request approved successfully',
                'serviceRequest' => $serviceRequest->fresh()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error approving service request: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error approving service request: ' . $e->getMessage()
            ], 500);
        }
    }

    public function decline(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'reason' => 'required|string|max:1000',
            ]);
            
            $serviceRequest = tbl_service_management_complaints::findOrFail($id);
            $serviceRequest->status = 'Declined';
            $serviceRequest->reason = $validated['reason'];
            $serviceRequest->save();
            
            return response()->json([
                'message' => 'Service request declined successfully',
                'serviceRequest' => $serviceRequest->fresh()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error declining service request: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error declining service request: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $serviceRequest = tbl_service_management_complaints::findOrFail($id);
            
            $validated = $request->validate([
                'status' => 'required|in:Pending,In Progress,Completed,Cancelled',
                'notes' => 'nullable|string|max:1000',
            ]);
            
            $serviceRequest->status = $validated['status'];
            if (isset($validated['notes'])) {
                $serviceRequest->notes = $validated['notes'];
            }
            
            $serviceRequest->save();
            
            return response()->json([
                'message' => 'Service request status updated successfully',
                'serviceRequest' => $serviceRequest->fresh()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating service request status: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error updating service request status: ' . $e->getMessage()
            ], 500);
        }
    }
}

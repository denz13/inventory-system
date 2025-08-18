<?php

namespace App\Http\Controllers\complaints;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_service_management_type;
use App\Models\tbl_service_management_category;
use App\Models\tbl_service_management_complaints;

class ComplaintsController extends Controller
{
    public function index()
    {
        $serviceTypes = tbl_service_management_type::where('status', 'Active')->get();
        
        // Get the authenticated user's complaints with relationships
        $userComplaints = tbl_service_management_complaints::with(['serviceCategory.serviceType'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return view('complaints.index-complaints', compact('serviceTypes', 'userComplaints'));
    }

    public function getCategories($typeId)
    {
        $categories = tbl_service_management_category::where('service_management_type_id', $typeId)
            ->where('status', 'Active')
            ->get();
        return response()->json($categories);
    }

    public function show($id)
    {
        $complaint = tbl_service_management_complaints::with(['serviceCategory.serviceType', 'user'])
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();
        
        // Debug: Log the complaint data
        \Log::info('Complaint data loaded successfully', [
            'complaint_id' => $complaint->id,
            'service_type' => $complaint->serviceType?->type ?? 'N/A',
            'service_category' => $complaint->serviceCategory?->category ?? 'N/A'
        ]);
        
        return response()->json($complaint);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_management_category_id' => 'required|exists:tbl_service_management_category,id',
            'complaint_description' => 'required|string|max:1000',
        ]);

        $complaint = new tbl_service_management_complaints();
        $complaint->service_management_category_id = $validated['service_management_category_id'];
        $complaint->user_id = auth()->id();
        $complaint->complaint_description = $validated['complaint_description'];
        $complaint->status = 'Pending';
        $complaint->save();

        return response()->json([
            'message' => 'Service request submitted successfully',
            'id' => $complaint->id,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        try {
            $complaint = tbl_service_management_complaints::where('id', $id)
                ->where('user_id', auth()->id())
                ->firstOrFail();
            
            $validated = $request->validate([
                'complaint_description' => 'required|string|max:1000',
            ]);
            
            $complaint->complaint_description = $validated['complaint_description'];
            $complaint->save();
            
            return response()->json([
                'message' => 'Service request updated successfully',
                'complaint' => $complaint->fresh()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating complaint: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error updating complaint: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $complaint = tbl_service_management_complaints::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();
        
        $complaint->delete();
        
        return response()->json([
            'message' => 'Service request deleted successfully'
        ]);
    }
}

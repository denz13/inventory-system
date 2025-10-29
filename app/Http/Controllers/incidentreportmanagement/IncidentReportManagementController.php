<?php

namespace App\Http\Controllers\incidentreportmanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_incident_report;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class IncidentReportManagementController extends Controller
{
    public function index(Request $request)
    {
        // Build query for incident reports
        $query = tbl_incident_report::with(['user', 'assignedGuard']);
        
        // Apply search filter
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('person_involved_name', 'like', "%{$search}%")
                  ->orWhere('designation', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('location_of_incident', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }
        
        // Apply status filter
        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }
        
        // Apply street filter
        if ($request->has('location') && $request->location != 'all') {
            $query->where('street', $request->location);
        }
        
        // Apply date filter
        if ($request->has('date_filter') && $request->date_filter != 'all') {
            $dateFilter = $request->date_filter;
            $now = now();
            
            switch ($dateFilter) {
                case 'today':
                    $query->whereDate('created_at', $now->toDateString());
                    break;
                case 'yesterday':
                    $query->whereDate('created_at', $now->subDay()->toDateString());
                    break;
                case 'this-week':
                    $query->whereBetween('created_at', [$now->startOfWeek(), $now->endOfWeek()]);
                    break;
                case 'last-week':
                    $query->whereBetween('created_at', [$now->subWeek()->startOfWeek(), $now->subWeek()->endOfWeek()]);
                    break;
                case 'this-month':
                    $query->whereMonth('created_at', $now->month)->whereYear('created_at', $now->year);
                    break;
                case 'last-month':
                    $query->whereMonth('created_at', $now->subMonth()->month)->whereYear('created_at', $now->subMonth()->year);
                    break;
                case 'this-year':
                    $query->whereYear('created_at', $now->year);
                    break;
            }
        }
        
        $perPage = $request->input('per_page', 10);
        $incidentReports = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $guards = User::where('role', 'security personnel')->where('active', true)->get();
        
        // Get unique streets from incident reports
        $streets = tbl_incident_report::whereNotNull('street')
            ->where('street', '!=', '')
            ->distinct()
            ->pluck('street')
            ->sort()
            ->values();

        return view('incident-report-management.incident-report-management', compact('incidentReports', 'guards', 'streets'));
    }

    public function show($id): JsonResponse
    {
        $incidentReport = tbl_incident_report::with(['user', 'assignedGuard'])->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $incidentReport
        ]);
    }

    public function updateStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:Pending,Under Investigation,Resolved,Closed'
        ]);

        $incidentReport = tbl_incident_report::findOrFail($id);
        $incidentReport->update([
            'status' => $request->status
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Incident report status updated successfully',
            'data' => $incidentReport
        ]);
    }

    public function assign(Request $request, $id): JsonResponse
    {
        $request->validate([
            'guard_id' => 'required|exists:users,id'
        ]);

        $incidentReport = tbl_incident_report::findOrFail($id);
        $incidentReport->update([
            'guard_id' => $request->guard_id,
            'status' => 'Under Investigation'
        ]);

        $incidentReport->load(['assignedGuard']);

        return response()->json([
            'success' => true,
            'message' => 'Guard assigned successfully',
            'data' => $incidentReport
        ]);
    }
}

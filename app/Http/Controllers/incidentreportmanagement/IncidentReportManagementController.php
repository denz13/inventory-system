<?php

namespace App\Http\Controllers\incidentreportmanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_incident_report;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class IncidentReportManagementController extends Controller
{
    public function index()
    {
        $incidentReports = tbl_incident_report::with(['user', 'assignedGuard'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $guards = User::where('role', 'security personnel')->where('active', true)->get();

        return view('incident-report-management.incident-report-management', compact('incidentReports', 'guards'));
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

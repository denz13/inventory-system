<?php

namespace App\Http\Controllers\appointmentmanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_appointment;

class AppointmentManagementController extends Controller
{
    public function index()
    {
        $appointments = tbl_appointment::orderBy('created_at', 'desc')->paginate(10);
        
        return view('appointment-management.appointment-management', compact('appointments'));
    }

    public function show($id)
    {
        try {
            $appointment = tbl_appointment::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'appointment' => $appointment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,cancelled,completed',
            'remarks' => 'nullable|string|max:500'
        ]);

        try {
            $appointment = tbl_appointment::findOrFail($id);
            $oldStatus = $appointment->status;
            $appointment->status = $request->status;
            $appointment->remarks = $request->remarks;
            $appointment->save();

            // Log the activity
            try {
                $appointment->logCustom("Appointment status changed from '{$oldStatus}' to '{$request->status}' for tracking number: {$appointment->tracking_number}");
            } catch (\Exception $logError) {
                \Log::error('Failed to log appointment status change: ' . $logError->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Appointment status updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating appointment status: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $appointment = tbl_appointment::findOrFail($id);
            
            // Log the activity before deletion
            try {
                $appointment->logCustom("Appointment deleted - Tracking number: {$appointment->tracking_number}, Status: {$appointment->status}");
            } catch (\Exception $logError) {
                \Log::error('Failed to log appointment deletion: ' . $logError->getMessage());
            }
            
            $appointment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Appointment deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting appointment: ' . $e->getMessage()
            ], 500);
        }
    }
}

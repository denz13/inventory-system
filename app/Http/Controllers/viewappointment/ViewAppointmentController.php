<?php

namespace App\Http\Controllers\viewappointment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_appointment;

class ViewAppointmentController extends Controller
{
    public function index()
    {
        return view('view-appointments.view-appointments');
    }

    public function getAppointmentByTrackingNumber(Request $request)
    {
        $request->validate([
            'tracking_number' => 'required|string'
        ]);

        try {
            $appointment = tbl_appointment::where('tracking_number', $request->tracking_number)->first();

            if (!$appointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment not found with this tracking number.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'appointment' => [
                    'id' => $appointment->id,
                    'description' => $appointment->description,
                    'appointment_date' => $appointment->appointment_date,
                    'tracking_number' => $appointment->tracking_number,
                    'status' => $appointment->status,
                    'remarks' => $appointment->remarks,
                    'is_expired' => $appointment->is_expired,
                    'created_at' => $appointment->created_at,
                    'updated_at' => $appointment->updated_at
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving appointment details: ' . $e->getMessage()
            ], 500);
        }
    }
}

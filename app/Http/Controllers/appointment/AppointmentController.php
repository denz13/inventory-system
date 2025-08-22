<?php

namespace App\Http\Controllers\appointment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_appointment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = tbl_appointment::orderBy('appointment_date', 'asc')
            ->get();
        
        return view('appointment.appointment', compact('appointments'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'required|string|max:1000',
            'appointment_date' => 'required|date|after:today',
            'tracking_number' => 'nullable|string|max:255',
            'remarks' => 'nullable|string|max:1000',
            'status' => 'nullable|in:pending,approved,cancelled,completed',
            'is_expired' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $appointment = tbl_appointment::create([
                'description' => $request->description,
                'appointment_date' => $request->appointment_date,
                'tracking_number' => $request->tracking_number ?? 'APT-' . time(),
                'remarks' => $request->remarks,
                'status' => $request->status ?? 'pending',
                'is_expired' => $request->is_expired ?? false
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment created successfully',
                'appointment' => $appointment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating appointment: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $appointment = tbl_appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'appointment' => $appointment
        ]);
    }

    /**
     * Get the next available ID for tracking number generation
     */
    public function getNextId()
    {
        try {
            // Get the highest ID from the appointments table
            $maxId = tbl_appointment::max('id');
            
            // If no appointments exist, start from 1, otherwise increment by 1
            $nextId = $maxId ? $maxId + 1 : 1;
            
            return response()->json([
                'success' => true,
                'next_id' => $nextId
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error getting next ID: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $appointment = tbl_appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'description' => 'required|string|max:1000',
            'appointment_date' => 'required|date|after:today',
            'tracking_number' => 'nullable|string|max:255',
            'remarks' => 'nullable|string|max:1000',
            'status' => 'nullable|in:pending,approved,cancelled,completed',
            'is_expired' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $appointment->update([
                'description' => $request->description,
                'appointment_date' => $request->appointment_date,
                'tracking_number' => $request->tracking_number,
                'remarks' => $request->remarks,
                'status' => $request->status,
                'is_expired' => $request->is_expired
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment updated successfully',
                'appointment' => $appointment->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating appointment: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $appointment = tbl_appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        try {
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

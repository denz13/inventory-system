<?php

namespace App\Http\Controllers\appointment_calendar;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\appointment;
use App\Models\appointment_category;

class AppointmentCalendarController extends Controller
{
    public function index()
    {
        // Get all appointments with relationships
        $appointments = appointment::with(['users', 'appointmentCategory'])
            ->get()
            ->map(function($appointment) {
                return [
                    'id' => $appointment->id,
                    'description' => $appointment->description,
                    'appointment_date' => $appointment->appointment_date,
                    'time' => $appointment->time,
                    'tracking_number' => $appointment->tracking_number,
                    'remarks' => $appointment->remarks,
                    'status' => $appointment->status,
                    'user_name' => $appointment->users ? $appointment->users->name : 'N/A',
                    'category_name' => $appointment->appointmentCategory ? $appointment->appointmentCategory->category_name : 'N/A',
                ];
            })->toArray();
        
        return view('appointment_calendar.appointment_calendar', compact('appointments'));
    }
    
    public function getAppointments()
    {
        // Get all appointments with relationships and format for FullCalendar
        $appointments = appointment::with(['users', 'appointmentCategory'])
            ->get()
            ->map(function($appointment) {
                return [
                    'id' => $appointment->id,
                    'title' => $appointment->description,
                    'start' => $appointment->appointment_date,
                    'description' => $appointment->description,
                    'tracking_number' => $appointment->tracking_number,
                    'remarks' => $appointment->remarks,
                    'status' => $appointment->status,
                    'user_name' => $appointment->users ? $appointment->users->name : 'N/A',
                    'category_name' => $appointment->appointmentCategory ? $appointment->appointmentCategory->category_name : 'N/A',
                    'className' => $this->getStatusClass($appointment->status)
                ];
            });
        
        return response()->json($appointments);
    }
    
    private function getStatusClass($status)
    {
        switch(strtolower($status)) {
            case 'pending':
                return 'bg-warning';
            case 'approved':
                return 'bg-success';
            case 'cancelled':
                return 'bg-danger';
            case 'completed':
                return 'bg-primary';
            default:
                return 'bg-info';
        }
    }
}

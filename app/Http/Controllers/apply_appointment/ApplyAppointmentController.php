<?php

namespace App\Http\Controllers\apply_appointment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\appointment;
use App\Models\appointment_category;
use App\Models\appointment_schedule_daily;
use App\Models\appointment_schedule_dates;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ApplyAppointmentController extends Controller
{
    public function index()
    {
        // Get active appointment categories
        $categories = appointment_category::where('status', 'Active')
            ->orderBy('category_name', 'asc')
            ->get();
        
        // Get user's appointments with pagination
        $appointments = appointment::with(['users', 'appointmentCategory'])
            ->where('users_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        // Get active schedule with dates
        $activeSchedule = appointment_schedule_daily::with('scheduleDates')
            ->where('status', 'Active')
            ->first();
        
        // Get available dates from active schedule
        $availableDates = [];
        if ($activeSchedule && $activeSchedule->scheduleDates) {
            $availableDates = $activeSchedule->scheduleDates()
                ->where('status', 'Active')
                ->pluck('dates')
                ->toArray();
        }
        
        return view('apply_appointment.apply_appointment', compact('categories', 'appointments', 'availableDates'));
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'appointment_category_id' => 'required|exists:appointment_category,id',
                'description' => 'required|string|max:1000',
                'appointment_date' => 'required|date|after_or_equal:today',
            ], [
                'appointment_category_id.required' => 'Please select an appointment category',
                'appointment_category_id.exists' => 'Selected category is invalid',
                'description.required' => 'Description is required',
                'description.max' => 'Description must not exceed 1000 characters',
                'appointment_date.required' => 'Appointment date is required',
                'appointment_date.after_or_equal' => 'Appointment date must be today or a future date',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                    'message' => 'Validation failed'
                ], 422);
            }

            // Check if there's an active appointment schedule limit
            $activeSchedule = appointment_schedule_daily::with('scheduleDates')
                ->where('status', 'Active')
                ->first();
            
            if (!$activeSchedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active appointment schedule is set. Please contact the administrator.'
                ], 400);
            }

            // Validate that the selected date is in the allowed schedule dates
            $selectedDate = Carbon::parse($request->appointment_date)->format('Y-m-d');
            $isDateAllowed = appointment_schedule_dates::where('appointment_schedule_daily_id', $activeSchedule->id)
                ->where('dates', $selectedDate)
                ->where('status', 'Active')
                ->exists();
            
            if (!$isDateAllowed) {
                return response()->json([
                    'success' => false,
                    'message' => 'The selected date is not available for appointments. Please choose from the available dates in the schedule.'
                ], 400);
            }

            // Count ALL existing appointments (not per date, but total)
            $existingAppointmentsCount = appointment::whereIn('status', ['Pending', 'Approved'])
                ->count();
            
            // Check if the limit has been reached
            if ($existingAppointmentsCount >= $activeSchedule->allow_number_of_appointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sorry, the maximum number of total appointments (' . $activeSchedule->allow_number_of_appointment . ') has been reached. No new appointments can be accepted at this time. Please try again later.'
                ], 400);
            }

            // Generate unique tracking number
            $trackingNumber = 'APT-' . strtoupper(Str::random(8));
            
            // Create appointment
            $appointment = appointment::create([
                'appointment_category_id' => $request->appointment_category_id,
                'users_id' => auth()->id(),
                'description' => $request->description,
                'appointment_date' => $request->appointment_date,
                'tracking_number' => $trackingNumber,
                'status' => 'Pending',
                'remarks' => null,
            ]);

            // Calculate remaining slots (total, not per day)
            $remainingSlots = $activeSchedule->allow_number_of_appointment - ($existingAppointmentsCount + 1);

            return response()->json([
                'success' => true,
                'message' => 'Appointment submitted successfully! Your tracking number is: ' . $trackingNumber . '. Total remaining slots: ' . $remainingSlots . ' out of ' . $activeSchedule->allow_number_of_appointment,
                'tracking_number' => $trackingNumber,
                'appointment' => $appointment,
                'remaining_slots' => $remainingSlots,
                'total_limit' => $activeSchedule->allow_number_of_appointment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error submitting appointment: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $appointment = appointment::with(['users', 'appointmentCategory'])
                ->where('users_id', auth()->id())
                ->findOrFail($id);

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

    public function checkAvailability(Request $request)
    {
        try {
            // Get today's day name (e.g., "Monday", "Tuesday")
            $todayDayName = Carbon::now()->format('l');
            
            // Get active schedule
            $activeSchedule = appointment_schedule_daily::where('status', 'Active')->first();
            
            if (!$activeSchedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active appointment schedule is set',
                    'available' => false
                ]);
            }

            // Check if TODAY's day is in the allowed schedule dates
            $isTodayAllowed = appointment_schedule_dates::where('appointment_schedule_daily_id', $activeSchedule->id)
                ->where('day', $todayDayName)
                ->where('status', 'Active')
                ->exists();
            
            if (!$isTodayAllowed) {
                return response()->json([
                    'success' => false,
                    'available' => false,
                    'message' => "Appointments cannot be submitted today ({$todayDayName}). This day is not in the allowed schedule. Please check back on an allowed day."
                ]);
            }

            // Count ALL existing appointments (total, not per date)
            $existingCount = appointment::whereIn('status', ['Pending', 'Approved'])
                ->count();
            
            $remainingSlots = $activeSchedule->allow_number_of_appointment - $existingCount;
            $available = $remainingSlots > 0;

            return response()->json([
                'success' => true,
                'available' => $available,
                'total_limit' => $activeSchedule->allow_number_of_appointment,
                'existing_count' => $existingCount,
                'remaining_slots' => $remainingSlots,
                'current_day' => $todayDayName,
                'message' => $available ? 
                    "Today ({$todayDayName}): Total available slots: $remainingSlots out of {$activeSchedule->allow_number_of_appointment}" : 
                    "Today ({$todayDayName}): Maximum total appointments reached. All {$activeSchedule->allow_number_of_appointment} slots are currently occupied."
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error checking availability: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $appointment = appointment::where('users_id', auth()->id())
                ->findOrFail($id);
            
            // Only allow cancellation if status is Pending
            if ($appointment->status !== 'Pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending appointments can be cancelled'
                ], 403);
            }
            
            $appointment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Appointment cancelled successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error cancelling appointment'
            ], 500);
        }
    }
}

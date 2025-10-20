<?php

namespace App\Http\Controllers\appointment_allowing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\appointment_schedule_daily;
use App\Models\appointment_schedule_dates;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AppointmentAllowingController extends Controller
{
    public function index()
    {
        // Get appointment schedule settings with pagination
        $schedules = appointment_schedule_daily::orderBy('created_at', 'desc')->paginate(10);
        
        // Get distinct statuses
        $statuses = appointment_schedule_daily::select('status')->distinct()->pluck('status')->toArray();
        
        return view('appointment_allowing.appointment_allowing', compact('schedules', 'statuses'));
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'allow_number_of_appointment' => 'required|integer|min:1|max:1000',
                'status' => 'required|in:Active,Inactive',
                'date_range' => 'required|string',
            ], [
                'allow_number_of_appointment.required' => 'Number of allowed appointments is required',
                'allow_number_of_appointment.integer' => 'Must be a valid number',
                'allow_number_of_appointment.min' => 'Must be at least 1',
                'allow_number_of_appointment.max' => 'Maximum allowed is 1000',
                'status.required' => 'Status is required',
                'status.in' => 'Status must be either Active or Inactive',
                'date_range.required' => 'Please select a date range',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                    'message' => 'Validation failed'
                ], 422);
            }

            // Deactivate all other active schedules if this one is active
            if ($request->status === 'Active') {
                appointment_schedule_daily::where('status', 'Active')->update(['status' => 'Inactive']);
            }

            // Create the main schedule
            $schedule = appointment_schedule_daily::create([
                'allow_number_of_appointment' => $request->allow_number_of_appointment,
                'status' => $request->status,
            ]);

            // Parse date range and create schedule dates
            $dateRange = $request->date_range;
            $dates = explode(' - ', $dateRange);
            
            if (count($dates) === 2) {
                $startDate = Carbon::parse(trim($dates[0]));
                $endDate = Carbon::parse(trim($dates[1]));
                
                // Iterate through each date in the range
                $currentDate = $startDate->copy();
                while ($currentDate->lte($endDate)) {
                    // Get day name (e.g., "Sunday", "Monday")
                    $dayName = $currentDate->format('l'); // Full day name
                    $dateFormatted = $currentDate->format('Y-m-d');
                    
                    // Create schedule date entry
                    appointment_schedule_dates::create([
                        'appointment_schedule_daily_id' => $schedule->id,
                        'day' => $dayName,
                        'dates' => $dateFormatted,
                        'status' => 'Active',
                    ]);
                    
                    // Move to next day
                    $currentDate->addDay();
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Appointment schedule set successfully with date range',
                'schedule' => $schedule
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error setting appointment schedule: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $schedule = appointment_schedule_daily::with('scheduleDates')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $schedule
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'allow_number_of_appointment' => 'required|integer|min:1|max:1000',
                'status' => 'required|in:Active,Inactive',
                'date_range' => 'required|string',
            ], [
                'allow_number_of_appointment.required' => 'Number of allowed appointments is required',
                'allow_number_of_appointment.integer' => 'Must be a valid number',
                'allow_number_of_appointment.min' => 'Must be at least 1',
                'allow_number_of_appointment.max' => 'Maximum allowed is 1000',
                'status.required' => 'Status is required',
                'status.in' => 'Status must be either Active or Inactive',
                'date_range.required' => 'Please select a date range',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                    'message' => 'Validation failed'
                ], 422);
            }

            $schedule = appointment_schedule_daily::findOrFail($id);
            
            // Deactivate all other active schedules if this one is being set to active
            if ($request->status === 'Active') {
                appointment_schedule_daily::where('id', '!=', $id)->where('status', 'Active')->update(['status' => 'Inactive']);
            }
            
            $schedule->update([
                'allow_number_of_appointment' => $request->allow_number_of_appointment,
                'status' => $request->status,
            ]);

            // Delete existing schedule dates for this schedule
            appointment_schedule_dates::where('appointment_schedule_daily_id', $id)->delete();

            // Parse date range and create new schedule dates
            $dateRange = $request->date_range;
            $dates = explode(' - ', $dateRange);
            
            if (count($dates) === 2) {
                $startDate = Carbon::parse(trim($dates[0]));
                $endDate = Carbon::parse(trim($dates[1]));
                
                // Iterate through each date in the range
                $currentDate = $startDate->copy();
                while ($currentDate->lte($endDate)) {
                    // Get day name (e.g., "Sunday", "Monday")
                    $dayName = $currentDate->format('l'); // Full day name
                    $dateFormatted = $currentDate->format('Y-m-d');
                    
                    // Create schedule date entry
                    appointment_schedule_dates::create([
                        'appointment_schedule_daily_id' => $schedule->id,
                        'day' => $dayName,
                        'dates' => $dateFormatted,
                        'status' => 'Active',
                    ]);
                    
                    // Move to next day
                    $currentDate->addDay();
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Appointment schedule updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating appointment schedule: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $schedule = appointment_schedule_daily::findOrFail($id);
            
            // Don't allow deletion of active schedule
            if ($schedule->status === 'Active') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete an active schedule. Please deactivate it first.'
                ], 403);
            }
            
            $schedule->delete();

            return response()->json([
                'success' => true,
                'message' => 'Schedule deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting schedule'
            ], 500);
        }
    }
}

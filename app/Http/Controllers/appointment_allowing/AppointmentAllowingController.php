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
    public function index(Request $request)
    {
        // Get per_page from request, default to 10
        $perPage = $request->input('per_page', 10);
        
        // Start with base query
        $query = appointment_schedule_daily::query();
        
        // Apply search filter - comprehensive search across all fields
        if ($request->has('search') && $request->search != '') {
            $search = trim($request->search);
            $query->where(function($q) use ($search) {
                // Search in allow_number_of_appointment
                $q->where('allow_number_of_appointment', 'like', "%{$search}%")
                  // Search in status
                  ->orWhere('status', 'like', "%{$search}%")
                  // Search in created_at (formatted)
                  ->orWhere('created_at', 'like', "%{$search}%")
                  // Search in related schedule dates
                  ->orWhereHas('scheduleDates', function($dateQuery) use ($search) {
                      // Search in dates field (YYYY-MM-DD format)
                      $dateQuery->where('dates', 'like', "%{$search}%")
                                // Search in day name (Monday, Tuesday, etc.)
                                ->orWhere('day', 'like', "%{$search}%");
                  });
                
                // Month and day name mapping
                $monthMap = [
                    'january' => '01', 'jan' => '01',
                    'february' => '02', 'feb' => '02',
                    'march' => '03', 'mar' => '03',
                    'april' => '04', 'apr' => '04',
                    'may' => '05',
                    'june' => '06', 'jun' => '06',
                    'july' => '07', 'jul' => '07',
                    'august' => '08', 'aug' => '08',
                    'september' => '09', 'sep' => '09', 'sept' => '09',
                    'october' => '10', 'oct' => '10',
                    'november' => '11', 'nov' => '11',
                    'december' => '12', 'dec' => '12',
                ];
                
                $searchLower = strtolower($search);
                
                // Check if search contains month name + day (e.g., "Oct 27", "October 27")
                foreach ($monthMap as $monthName => $monthNum) {
                    if (strpos($searchLower, $monthName) !== false) {
                        // Extract the day number from the search string
                        $pattern = '/' . preg_quote($monthName, '/') . '\s*(\d{1,2})/i';
                        if (preg_match($pattern, $searchLower, $matches)) {
                            $dayNum = str_pad($matches[1], 2, '0', STR_PAD_LEFT);
                            // Search for YYYY-MM-DD format: any year, specific month and day
                            $q->orWhereHas('scheduleDates', function($dateQuery) use ($monthNum, $dayNum) {
                                $dateQuery->where('dates', 'like', "%-{$monthNum}-{$dayNum}");
                            });
                        } else {
                            // Just month name, no day specified
                            $q->orWhereHas('scheduleDates', function($dateQuery) use ($monthNum) {
                                $dateQuery->where('dates', 'like', "%-{$monthNum}-%");
                            });
                        }
                        break; // Stop after first match
                    }
                }
                
                // If search is a pure number (1-31), search for day in dates
                if (is_numeric($search) && $search >= 1 && $search <= 31) {
                    $dayNum = str_pad($search, 2, '0', STR_PAD_LEFT);
                    $q->orWhereHas('scheduleDates', function($dateQuery) use ($dayNum) {
                        // Search for day in format -DD or -DD-
                        $dateQuery->where('dates', 'like', "%-{$dayNum}")
                                  ->orWhere('dates', 'like', "%-{$dayNum}-%");
                    });
                }
                
                // Search for date formats like "10/27", "10-27", "2024-10-27"
                if (preg_match('/(\d{1,2})[\/-](\d{1,2})/', $search, $matches)) {
                    $month = str_pad($matches[1], 2, '0', STR_PAD_LEFT);
                    $day = str_pad($matches[2], 2, '0', STR_PAD_LEFT);
                    $q->orWhereHas('scheduleDates', function($dateQuery) use ($month, $day) {
                        $dateQuery->where('dates', 'like', "%-{$month}-{$day}");
                    });
                }
            });
        }
        
        // Apply status filter
        if ($request->has('status') && $request->status != '' && $request->status != 'all') {
            $query->where('status', $request->status);
        }
        
        // Order and paginate
        $schedules = $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->appends($request->except('page'));
        
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

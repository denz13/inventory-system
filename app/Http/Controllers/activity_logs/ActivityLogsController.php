<?php

namespace App\Http\Controllers\activity_logs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActivityLog;

class ActivityLogsController extends Controller
{
    public function index(Request $request)
    {
        // Get per_page from request, default to 10
        $perPage = $request->input('per_page', 10);
        
        // Start with base query
        $query = ActivityLog::with('user');
        
        // Apply search filter - comprehensive search
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                // Search in activity log ID
                $q->where('id', 'like', "%{$search}%")
                  // Search in activity log description
                  ->orWhere('description', 'like', "%{$search}%")
                  // Search in created_at timestamp
                  ->orWhere('created_at', 'like', "%{$search}%")
                  // Search in user name, email, and role
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%")
                                ->orWhere('role', 'like', "%{$search}%");
                  });
                
                // Also search for month names (October, Oct, etc.)
                $monthMap = [
                    'january' => '1', 'jan' => '1',
                    'february' => '2', 'feb' => '2',
                    'march' => '3', 'mar' => '3',
                    'april' => '4', 'apr' => '4',
                    'may' => '5',
                    'june' => '6', 'jun' => '6',
                    'july' => '7', 'jul' => '7',
                    'august' => '8', 'aug' => '8',
                    'september' => '9', 'sep' => '9', 'sept' => '9',
                    'october' => '10', 'oct' => '10',
                    'november' => '11', 'nov' => '11',
                    'december' => '12', 'dec' => '12',
                ];
                
                $searchLower = strtolower($search);
                if (isset($monthMap[$searchLower])) {
                    $monthNum = $monthMap[$searchLower];
                    // Search for month in created_at
                    $q->orWhere('created_at', 'like', "%-{$monthNum}-%")
                      ->orWhere('created_at', 'like', "%-0{$monthNum}-%");
                }
                
                // If search is a number (1-31), search for day in created_at
                if (is_numeric($search) && $search >= 1 && $search <= 31) {
                    $dayNum = (int)$search;
                    $q->orWhere('created_at', 'like', "%-{$dayNum} %")
                      ->orWhere('created_at', 'like', "%-0{$dayNum} %");
                }
            });
        }
        
        // Order and paginate
        $activityLogs = $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->appends($request->except('page'));

        return view('activity_logs.activity_logs', compact('activityLogs'));
    }

    public function show($id)
    {
        try {
            $activityLog = ActivityLog::with('user')->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $activityLog
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Activity log not found'
            ], 404);
        }
    }
}

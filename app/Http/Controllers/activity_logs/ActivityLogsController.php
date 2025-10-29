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
        
        // Apply search filter
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                // Search in activity log description
                $q->where('description', 'like', "%{$search}%")
                  // Search in user name and email
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
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

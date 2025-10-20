<?php

namespace App\Http\Controllers\activity_logs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActivityLog;

class ActivityLogsController extends Controller
{
    public function index()
    {
        // Get per_page from request, default to 10
        $perPage = request('per_page', 10);
        
        // Get all activity logs with user relationship, ordered by most recent
        $activityLogs = ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

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

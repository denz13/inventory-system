<?php

namespace App\Http\Controllers\appointmentmanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\appointment;
use App\Models\appointment_category;

class AppointmentManagementController extends Controller
{
    public function index(Request $request)
    {
        // Get per_page from request, default to 10
        $perPage = $request->get('per_page', 10);
        
        // Ensure per_page is a valid value
        $perPage = in_array($perPage, [10, 25, 35, 50]) ? $perPage : 10;
        
        // Get all unique statuses from database
        $allStatuses = appointment::select('status')
            ->distinct()
            ->whereNotNull('status')
            ->pluck('status')
            ->sort()
            ->values();
        
        // Get all unique times from database (time is VARCHAR, already formatted)
        $allTimes = appointment::select('time')
            ->distinct()
            ->whereNotNull('time')
            ->where('time', '!=', '')
            ->orderBy('time')
            ->pluck('time')
            ->map(function($time) {
                // Time is already stored as "01:30 PM" format in VARCHAR column
                return [
                    'raw' => $time,  // Store as-is: "01:30 PM"
                    'display' => $time  // Display as-is: "01:30 PM"
                ];
            })
            ->unique('raw')
            ->values();
        
        // Start query with relationships
        $query = appointment::with(['users', 'appointmentCategory']);
        
        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('tracking_number', 'like', '%' . $searchTerm . '%')
                  ->orWhere('description', 'like', '%' . $searchTerm . '%')
                  ->orWhere('status', 'like', '%' . $searchTerm . '%')
                  ->orWhere('remarks', 'like', '%' . $searchTerm . '%')
                  ->orWhereHas('appointmentCategory', function($categoryQuery) use ($searchTerm) {
                      $categoryQuery->where('category_name', 'like', '%' . $searchTerm . '%');
                  });
            });
        }
        
        // Status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Category filter
        if ($request->has('category') && $request->category !== 'all') {
            $query->whereHas('appointmentCategory', function($categoryQuery) use ($request) {
                $categoryQuery->where('category_name', $request->category);
            });
        }
        
        // Time filter - direct VARCHAR comparison (time column is VARCHAR)
        if ($request->has('time') && $request->time !== 'all') {
            $timeFilter = $request->time;
            // Direct string comparison since time is VARCHAR
            $query->where('time', $timeFilter);
        }
        
        // Date range filter
        if ($request->has('date_from') && $request->has('date_to')) {
            $dateFrom = $request->date_from;
            $dateTo = $request->date_to;
            
            if (!empty($dateFrom) && !empty($dateTo)) {
                $query->whereDate('appointment_date', '>=', $dateFrom)
                      ->whereDate('appointment_date', '<=', $dateTo);
            }
        }
        
        // Order by created_at desc
        $query->orderBy('created_at', 'desc');
        
        // Paginate results
        $appointments = $query->paginate($perPage)->appends($request->except('page'));
        
        return view('appointment-management.appointment-management', compact('appointments', 'allStatuses', 'allTimes'));
    }

    public function show($id)
    {
        try {
            // Get appointment with relationships
            $appointment = appointment::with(['users', 'appointmentCategory'])
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

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,cancelled,completed',
            'remarks' => 'nullable|string|max:500'
        ]);

        try {
            $appointment = appointment::findOrFail($id);
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
            $appointment = appointment::findOrFail($id);
            
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

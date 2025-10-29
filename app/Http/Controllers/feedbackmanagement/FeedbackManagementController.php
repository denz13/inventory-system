<?php

namespace App\Http\Controllers\feedbackmanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_feedback;
use App\Models\User;

class FeedbackManagementController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Get per_page from request, default to 10
            $perPage = $request->get('per_page', 10);
            
            // Ensure per_page is a valid value
            $perPage = in_array($perPage, [10, 25, 35, 50]) ? $perPage : 10;
            
            // Start query
            $query = tbl_feedback::with('user')->whereHas('user');
            
            // Search functionality
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('description', 'like', '%' . $searchTerm . '%')
                      ->orWhereHas('user', function($userQuery) use ($searchTerm) {
                          $userQuery->where('name', 'like', '%' . $searchTerm . '%')
                                    ->orWhere('email', 'like', '%' . $searchTerm . '%');
                      });
                });
            }
            
            // Rating filter
            if ($request->has('rating') && $request->rating !== 'all') {
                $query->where('rating', $request->rating);
            }
            
            // Status filter
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            
            // User filter
            if ($request->has('user_id') && $request->user_id !== 'all') {
                $query->where('user_id', $request->user_id);
            }
            
            // Date filter
            if ($request->has('date_filter') && $request->date_filter !== 'all') {
                $dateFilter = $request->date_filter;
                $now = now();
                
                switch ($dateFilter) {
                    case 'today':
                        $query->whereDate('created_at', $now->toDateString());
                        break;
                    case 'yesterday':
                        $query->whereDate('created_at', $now->subDay()->toDateString());
                        break;
                    case 'this-week':
                        $query->whereBetween('created_at', [
                            $now->startOfWeek()->toDateString(),
                            $now->endOfWeek()->toDateString()
                        ]);
                        break;
                    case 'last-week':
                        $query->whereBetween('created_at', [
                            $now->subWeek()->startOfWeek()->toDateString(),
                            $now->subWeek()->endOfWeek()->toDateString()
                        ]);
                        break;
                    case 'this-month':
                        $query->whereMonth('created_at', $now->month)
                              ->whereYear('created_at', $now->year);
                        break;
                    case 'last-month':
                        $query->whereMonth('created_at', $now->subMonth()->month)
                              ->whereYear('created_at', $now->subMonth()->year);
                        break;
                    case 'this-year':
                        $query->whereYear('created_at', $now->year);
                        break;
                }
            }
            
            // Order by created_at desc
            $query->orderBy('created_at', 'desc');
            
            // Paginate results
            $feedbacks = $query->paginate($perPage)->appends($request->except('page'));

            return view('feedback-management.feedback-management', compact('feedbacks'));
        } catch (\Exception $e) {
            return back()->with('error', 'Error loading feedback: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $feedback = tbl_feedback::with('user')->findOrFail($id);
            
            // Check if user exists
            if (!$feedback->user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Feedback user no longer exists'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'feedback' => $feedback
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error loading feedback details: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:active,inactive',
            ]);

            $feedback = tbl_feedback::findOrFail($id);
            $feedback->update([
                'status' => $request->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Feedback status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating feedback: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $feedback = tbl_feedback::findOrFail($id);
            $feedback->delete();

            return response()->json([
                'success' => true,
                'message' => 'Feedback deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting feedback: ' . $e->getMessage()
            ], 500);
        }
    }
}

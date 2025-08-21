<?php

namespace App\Http\Controllers\feedbackmanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_feedback;
use App\Models\User;

class FeedbackManagementController extends Controller
{
    public function index()
    {
        try {
            // Get all feedback from all users with user relationship
            $feedbacks = tbl_feedback::with('user')
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return view('feedback-management.feedback-management', compact('feedbacks'));
        } catch (\Exception $e) {
            return back()->with('error', 'Error loading feedback: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $feedback = tbl_feedback::with('user')->findOrFail($id);
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

<?php

namespace App\Http\Controllers\feedback;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_feedback;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    public function index()
    {
        // Get current user's feedback only
        $feedbacks = tbl_feedback::with(['user'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Get current user info
        $currentUser = auth()->user();

        return view('feedback.feedback', compact('feedbacks', 'currentUser'));
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'description' => 'required|string|max:1000',
                'rating' => 'required|integer|min:1|max:5',
            ], [
                'rating.min' => 'Please select a rating between 1 and 5 stars',
                'rating.required' => 'Please select a rating',
            ]);

            tbl_feedback::create([
                'user_id' => auth()->id(), // Use current logged-in user
                'description' => $request->description,
                'rating' => $request->rating,
                'status' => 'active', // Default status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Feedback created successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating feedback: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $feedback = tbl_feedback::with(['user'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'feedback' => $feedback
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Feedback not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'description' => 'required|string|max:1000',
                'rating' => 'required|integer|min:1|max:5',
                'status' => 'required|in:active,inactive',
            ]);

            $feedback = tbl_feedback::findOrFail($id);
            
            // Check if the current user owns this feedback (optional security check)
            if ($feedback->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only edit your own feedback'
                ], 403);
            }
            
            $feedback->update([
                'description' => $request->description,
                'rating' => $request->rating,
                'status' => $request->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Feedback updated successfully'
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
            
            // Check if the current user owns this feedback (optional security check)
            if ($feedback->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only delete your own feedback'
                ], 403);
            }
            
            $feedback->delete();

            return response()->json([
                'success' => true,
                'message' => 'Feedback deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting feedback'
            ], 500);
        }
    }
}

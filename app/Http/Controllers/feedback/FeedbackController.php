<?php

namespace App\Http\Controllers\feedback;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_feedback;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        // Get per_page from request, default to 10
        $perPage = $request->get('per_page', 10);
        
        // Ensure per_page is a valid value
        $perPage = in_array($perPage, [10, 25, 35, 50]) ? $perPage : 10;
        
        // Get current user's feedback only
        $feedbacks = tbl_feedback::with(['user'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Get current user info
        $currentUser = auth()->user();

        return view('feedback.feedback', compact('feedbacks', 'currentUser'));
    }

    public function store(Request $request)
    {
        try {
            $validator = \Validator::make($request->all(), [
                'description' => 'required|string',
                'rating' => 'required|integer|min:1|max:5',
            ], [
                'description.required' => 'Feedback description is required',
                'rating.required' => 'Please select a rating',
                'rating.min' => 'Please select a rating between 1 and 5 stars',
                'rating.max' => 'Please select a rating between 1 and 5 stars',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                    'message' => 'Validation failed'
                ], 422);
            }

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
            $validator = \Validator::make($request->all(), [
                'description' => 'required|string',
                'rating' => 'required|integer|min:1|max:5',
                'status' => 'required|in:active,inactive',
            ], [
                'description.required' => 'Feedback description is required',
                'rating.required' => 'Please select a rating',
                'rating.min' => 'Please select a rating between 1 and 5 stars',
                'rating.max' => 'Please select a rating between 1 and 5 stars',
                'status.required' => 'Status is required',
                'status.in' => 'Status must be either active or inactive',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                    'message' => 'Validation failed'
                ], 422);
            }

            $feedback = tbl_feedback::findOrFail($id);
            
            // Check if the current user owns this feedback (optional security check)
            if ($feedback->user_id != auth()->id()) {
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
            if ($feedback->user_id != auth()->id()) {
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

<?php

namespace App\Http\Controllers\newpassword;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class NewPasswordController extends Controller
{
    public function index()
    {
        // Check if user has valid password reset session
        if (!session('password_reset_user_id') || !session('password_reset_email')) {
            return redirect()->route('forgot-password.index')
                   ->with('error', 'Invalid password reset session. Please start over.');
        }

        return view('newpassword.newpassword');
    }

    public function store(Request $request)
    {
        // Check if user has valid password reset session
        if (!session('password_reset_user_id') || !session('password_reset_email')) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password reset session. Please start over.',
                'show_toast' => true,
                'toast_type' => 'error',
                'redirect' => route('forgot-password.index')
            ], 422);
        }

        // Validate the request
        $validator = Validator::make($request->all(), [
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'show_toast' => true,
                'toast_type' => 'error'
            ], 422);
        }

        $userId = session('password_reset_user_id');
        $user = User::find($userId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found. Please start over.',
                'show_toast' => true,
                'toast_type' => 'error',
                'redirect' => route('forgot-password.index')
            ], 422);
        }

        // Update user password
        $user->password = Hash::make($request->password);
        $user->save();

        // Clear password reset session
        session()->forget(['password_reset_user_id', 'password_reset_email']);

        // Log password reset
        \Log::info('Password reset successfully for user: ' . $user->email . ' (ID: ' . $user->id . ')');

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully! You can now login with your new password.',
            'show_toast' => true,
            'toast_type' => 'success',
            'redirect' => route('login.index')
        ]);
    }
}

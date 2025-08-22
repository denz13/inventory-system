<?php

namespace App\Http\Controllers\otp;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\tbl_otp;
use Carbon\Carbon;

class OtpController extends Controller
{
    public function index()
    {
        return view('otp.otp');
    }

    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'otp' => 'required|string|size:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please enter a valid 6-digit OTP',
                'show_toast' => true,
                'toast_type' => 'error'
            ], 422);
        }

        $inputOtp = $request->otp;
        
        // First, mark all expired OTPs as expired
        $this->markExpiredOtps();
        
        // Find the OTP record
        $otpRecord = tbl_otp::where('otp_code', $inputOtp)
                            ->notUsed()
                            ->first();

        // Check if OTP exists and is not used
        if (!$otpRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP or OTP has already been used',
                'show_toast' => true,
                'toast_type' => 'error'
            ], 422);
        }

        // Check if OTP has expired
        if ($otpRecord->isExpired()) {
            // Mark as expired
            $otpRecord->markAsExpired();
            
            return response()->json([
                'success' => false,
                'message' => 'OTP has expired. Please request a new one',
                'show_toast' => true,
                'toast_type' => 'error'
            ], 422);
        }

        // OTP is valid - mark as used
        $otpRecord->markAsUsed();
        
        // Get user information
        $user = $otpRecord->user;
        
        // Store user ID in session for password reset
        session(['password_reset_user_id' => $user->id]);
        session(['password_reset_email' => $user->email]);
        
        return response()->json([
            'success' => true,
            'message' => 'OTP verified successfully. You can now set your new password.',
            'show_toast' => true,
            'toast_type' => 'success',
            'redirect' => route('new-password.index')
        ]);
    }

    /**
     * Mark expired OTPs as expired
     */
    private function markExpiredOtps()
    {
        tbl_otp::notUsed()
               ->where('expire_at', '<', Carbon::now())
               ->update(['status' => tbl_otp::STATUS_EXPIRED]);
    }
}

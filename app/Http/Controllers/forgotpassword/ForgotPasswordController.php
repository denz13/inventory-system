<?php

namespace App\Http\Controllers\forgotpassword;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\tbl_otp;
use Carbon\Carbon;

class ForgotPasswordController extends Controller
{
    public function index()
    {
        return view('forgotpassword.forgot-password');
    }

    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please enter a valid email address',
                'show_toast' => true,
                'toast_type' => 'error'
            ], 422);
        }

        $email = $request->email;
        
        // Check if user exists
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email is not registered in our system',
                'show_toast' => true,
                'toast_type' => 'error'
            ], 422);
        }
        
        // Generate a 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Set expiration time (10 minutes from now)
        $expireAt = Carbon::now()->addMinutes(10);
        
        // Mark any existing unused OTPs for this user as expired
        tbl_otp::where('user_id', $user->id)
               ->notUsed()
               ->update(['status' => tbl_otp::STATUS_EXPIRED]);
        
        // Create new OTP record
        tbl_otp::create([
            'user_id' => $user->id,
            'email' => $email,
            'otp_code' => $otp,
            'status' => tbl_otp::STATUS_NOT_USED,
            'expire_at' => $expireAt
        ]);
        
        // Send OTP via email
        try {
            Mail::send('emails.forgot-password-otp', ['otp' => $otp, 'user' => $user], function($message) use ($email, $user) {
                $message->to($email, $user->name ?? 'User')
                        ->subject('Password Reset OTP - Golden Country Homes')
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });
            
            // Log successful email sending
            \Log::info('Password Reset OTP email sent successfully to ' . $email . ' (User ID: ' . $user->id . ')');
            
        } catch (\Exception $e) {
            // Log error but don't fail the request
            \Log::error('Failed to send OTP email to ' . $email . ': ' . $e->getMessage());
            
            // For testing, also log the OTP so you can still use it
            \Log::info('Password Reset OTP for ' . $email . ' (User ID: ' . $user->id . '): ' . $otp);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'OTP has been sent to your email address',
            'show_toast' => true,
            'toast_type' => 'success'
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Request\LoginRequest;
use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Notification;
use App\Models\tbl_announcement;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Show specified view.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function loginView()
    {
        // Fetch active public announcements
        $announcements = tbl_announcement::where('status', 'Active')
            ->where('visible_to', 'public')
            ->orderBy('created_at', 'desc')
            ->get();

        return view('login.index-login', compact('announcements'));
    }

    /**
     * Authenticate login user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(LoginRequest $request)
    {
        // Try to find user first for logging purposes
        $user = User::where('email', $request->email)->first();
        
        if (!Auth::attempt([
            'email' => $request->email,
            'password' => $request->password
        ])) {
            // Log failed login attempt
            try {
                if ($user) {
                    $user->logCustom("Failed login attempt for user: {$user->name} ({$user->email})");
                } else {
                    // Log failed login for non-existent user
                    ActivityLog::create([
                        'users_id' => null,
                        'description' => "Failed login attempt for non-existent email: {$request->email}"
                    ]);
                }
            } catch (\Exception $e) {
                // Log error but don't fail the login response
                \Log::error('Failed to log failed login attempt: ' . $e->getMessage());
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Wrong email or password.'
            ], 422);
        }

        // Get the authenticated user
        $authenticatedUser = Auth::user();
        
        try {
            // Log successful login
            $authenticatedUser->logCustom("User logged in successfully: {$authenticatedUser->name} ({$authenticatedUser->email})");
        } catch (\Exception $e) {
            // Log error but don't fail the login
            \Log::error('Failed to log login activity: ' . $e->getMessage());
        }
        
        try {
            // Send welcome notification
            $authenticatedUser->notifySuccess(
                'Welcome Back!', 
                "Hello {$authenticatedUser->name}, welcome back to Golden Country Homes!"
            );
        } catch (\Exception $e) {
            // Log error but don't fail the login
            \Log::error('Failed to send welcome notification: ' . $e->getMessage());
        }

        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'name' => $authenticatedUser->name,
                'email' => $authenticatedUser->email
            ]
        ]);
    }

    /**
     * Logout user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout()
    {
        // Log logout activity before logging out
        if (Auth::check()) {
            try {
                $user = Auth::user();
                $user->logCustom("User logged out: {$user->name} ({$user->email})");
            } catch (\Exception $e) {
                // Log error but don't fail the logout
                \Log::error('Failed to log logout activity: ' . $e->getMessage());
            }
        }
        
        Auth::logout();
        return redirect('login');
    }
}

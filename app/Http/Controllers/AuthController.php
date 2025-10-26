<?php

namespace App\Http\Controllers;

use App\Http\Request\LoginRequest;
use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Notification;
use App\Models\tbl_announcement;
use App\Models\User;
use App\Models\users_login;
use App\Models\tbl_otp;
use App\Models\system_settings;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Carbon\Carbon;

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

        // Fetch login center text from system settings
        $loginCenterText = system_settings::where('key', 'login_center_text')
            ->where('status', 'active')
            ->first();

        // Fetch login logo from system settings
        $loginLogo = system_settings::where('key', 'login_logo')
            ->where('status', 'active')
            ->first();

        // Fetch login top text from system settings
        $loginTopText = system_settings::where('key', 'login_top_text')
            ->where('status', 'active')
            ->first();

        // Fetch login top logo from system settings
        $loginTopLogo = system_settings::where('key', 'login_top_logo')
            ->where('status', 'active')
            ->first();

        // Fetch login bottom text from system settings
        $loginBottomText = system_settings::where('key', 'login_bottom_text')
            ->where('status', 'active')
            ->first();

        return view('login.index-login', compact('announcements', 'loginCenterText', 'loginLogo', 'loginTopText', 'loginTopLogo', 'loginBottomText'));
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
        
        // Check if user exists and is active BEFORE attempting login
        if ($user && (int) $user->active !== 1) {
            // Log inactive user login attempt
            try {
                $user->logCustom("Login attempt blocked for inactive user: {$user->name} ({$user->email})");
            } catch (\Exception $e) {
                Log::error('Failed to log inactive user login attempt: ' . $e->getMessage());
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive. Please contact the administrator for assistance.'
            ], 403);
        }
        
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
                Log::error('Failed to log failed login attempt: ' . $e->getMessage());
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Wrong email or password.'
            ], 422);
        }

        // Get the authenticated user
        $authenticatedUser = Auth::user();
        
        // Double-check active status after authentication
        if ((int) $authenticatedUser->active !== 1) {
            // Log out the user immediately
            Auth::logout();
            
            try {
                $authenticatedUser->logCustom("Login blocked for inactive user after authentication: {$authenticatedUser->name} ({$authenticatedUser->email})");
            } catch (\Exception $e) {
                Log::error('Failed to log inactive user: ' . $e->getMessage());
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Your account has been deactivated. Please contact the administrator.'
            ], 403);
        }
        
        // Check if device verification is needed
        $publicIp = $request->input('public_ip');
        $ipAddress = $publicIp ?: $request->ip();
        $macAddress = $request->input('mac_address', 'N/A');
        $location = $this->getLocationFromIP($ipAddress);
        
        $needsVerification = $this->checkIfDeviceVerificationNeeded(
            $authenticatedUser->id,
            $macAddress,
            $ipAddress,
            $location
        );
        
        if ($needsVerification) {
            // Generate and send OTP
            $otpCode = $this->generateAndSendOTP($authenticatedUser, $macAddress, $ipAddress, $location);
            
            // Logout the user temporarily until they verify
            Auth::logout();
            
            return response()->json([
                'success' => false,
                'requires_verification' => true,
                'message' => 'New device detected! A verification code has been sent to your email.',
                'email' => $authenticatedUser->email,
                'user_id' => $authenticatedUser->id
            ]);
        }
        
        try {
            // Set user as online
            $authenticatedUser->is_online = 1;
            $authenticatedUser->save();
        } catch (\Exception $e) {
            // Log error but don't fail the login
            Log::error('Failed to set user online status: ' . $e->getMessage());
        }
        
        try {
            // Capture login information
            // Use public IP from client if available, otherwise use server-detected IP
            $publicIp = $request->input('public_ip');
            $ipAddress = $publicIp ?: $request->ip();
            
            $browser = $this->getBrowserInfo($request);
            $macAddress = $request->input('mac_address', 'N/A'); // Will be sent from frontend
            $location = $this->getLocationFromIP($ipAddress);
            
            // Save login information to users_login table
            users_login::create([
                'users_id' => $authenticatedUser->id,
                'browser' => $browser,
                'ip_address' => $ipAddress,
                'mac_address' => $macAddress,
                'location' => $location,
                'status' => 'login'
            ]);
            
            Log::info("Login tracked for user {$authenticatedUser->id}: IP={$ipAddress}, Browser={$browser}, Location={$location}");
        } catch (\Exception $e) {
            // Log error but don't fail the login
            Log::error('Failed to save login information: ' . $e->getMessage());
        }
        
        try {
            // Log successful login
            $authenticatedUser->logCustom("User logged in successfully: {$authenticatedUser->name} ({$authenticatedUser->email}) from {$ipAddress}");
        } catch (\Exception $e) {
            // Log error but don't fail the login
            Log::error('Failed to log login activity: ' . $e->getMessage());
        }
        
        try {
            // Send welcome notification
            $authenticatedUser->notifySuccess(
                'Welcome Back!', 
                "Hello {$authenticatedUser->name}, welcome back to Golden Country Homes!"
            );
        } catch (\Exception $e) {
            // Log error but don't fail the login
            Log::error('Failed to send welcome notification: ' . $e->getMessage());
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
    public function logout(Request $request)
    {
        // Log logout activity before logging out
        if (Auth::check()) {
            try {
                $user = Auth::user();
                
                // Capture logout information
                // Use public IP from client if available, otherwise use server-detected IP
                $publicIp = $request->input('public_ip');
                $ipAddress = $publicIp ?: $request->ip();
                
                $browser = $this->getBrowserInfo($request);
                $macAddress = $request->input('mac_address', 'N/A');
                $location = $this->getLocationFromIP($ipAddress);
                
                // Save logout information to users_login table
                users_login::create([
                    'users_id' => $user->id,
                    'browser' => $browser,
                    'ip_address' => $ipAddress,
                    'mac_address' => $macAddress,
                    'location' => $location,
                    'status' => 'logout'
                ]);
                
                // Set user as offline
                $user->is_online = 0;
                $user->save();
                
                $user->logCustom("User logged out: {$user->name} ({$user->email}) from {$ipAddress}");
            } catch (\Exception $e) {
                // Log error but don't fail the logout
                Log::error('Failed to log logout activity: ' . $e->getMessage());
            }
        }
        
        Auth::logout();
        return redirect('login');
    }
    
    /**
     * Get browser information from user agent
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
    private function getBrowserInfo(Request $request)
    {
        $userAgent = $request->header('User-Agent');
        
        if (!$userAgent) {
            return 'Unknown Browser';
        }
        
        // Detect browser
        $browser = 'Unknown Browser';
        $version = '';
        
        // Check for common browsers
        if (preg_match('/MSIE/i', $userAgent) && !preg_match('/Opera/i', $userAgent)) {
            $browser = 'Internet Explorer';
        } elseif (preg_match('/Firefox/i', $userAgent)) {
            $browser = 'Firefox';
            if (preg_match('/Firefox\/([0-9.]+)/i', $userAgent, $match)) {
                $version = $match[1];
            }
        } elseif (preg_match('/Chrome/i', $userAgent) && !preg_match('/Edge/i', $userAgent)) {
            $browser = 'Chrome';
            if (preg_match('/Chrome\/([0-9.]+)/i', $userAgent, $match)) {
                $version = $match[1];
            }
        } elseif (preg_match('/Safari/i', $userAgent) && !preg_match('/Chrome/i', $userAgent)) {
            $browser = 'Safari';
            if (preg_match('/Version\/([0-9.]+)/i', $userAgent, $match)) {
                $version = $match[1];
            }
        } elseif (preg_match('/Opera|OPR/i', $userAgent)) {
            $browser = 'Opera';
            if (preg_match('/OPR\/([0-9.]+)/i', $userAgent, $match)) {
                $version = $match[1];
            }
        } elseif (preg_match('/Edge/i', $userAgent)) {
            $browser = 'Edge';
            if (preg_match('/Edge\/([0-9.]+)/i', $userAgent, $match)) {
                $version = $match[1];
            }
        }
        
        // Detect operating system
        $os = 'Unknown OS';
        if (preg_match('/Windows NT 10.0/i', $userAgent)) {
            $os = 'Windows 10';
        } elseif (preg_match('/Windows NT 6.3/i', $userAgent)) {
            $os = 'Windows 8.1';
        } elseif (preg_match('/Windows NT 6.2/i', $userAgent)) {
            $os = 'Windows 8';
        } elseif (preg_match('/Windows NT 6.1/i', $userAgent)) {
            $os = 'Windows 7';
        } elseif (preg_match('/Windows NT 6.0/i', $userAgent)) {
            $os = 'Windows Vista';
        } elseif (preg_match('/Windows NT 5.1|Windows XP/i', $userAgent)) {
            $os = 'Windows XP';
        } elseif (preg_match('/Macintosh|Mac OS X/i', $userAgent)) {
            $os = 'Mac OS X';
        } elseif (preg_match('/Linux/i', $userAgent)) {
            $os = 'Linux';
        } elseif (preg_match('/Android/i', $userAgent)) {
            $os = 'Android';
        } elseif (preg_match('/iPhone|iPad|iPod/i', $userAgent)) {
            $os = 'iOS';
        }
        
        $result = $browser;
        if ($version) {
            $result .= ' ' . $version;
        }
        $result .= ' on ' . $os;
        
        return $result;
    }
    
    /**
     * Get location information from IP address
     *
     * @param  string  $ip
     * @return string
     */
    private function getLocationFromIP($ip)
    {
        // Check if it's a local IP
        if ($ip === '127.0.0.1' || $ip === '::1' || strpos($ip, '192.168.') === 0 || strpos($ip, '10.') === 0) {
            return 'Local Network';
        }
        
        try {
            // Use ip-api.com free API (no key required, 45 requests per minute limit)
            $url = "http://ip-api.com/json/{$ip}?fields=status,country,regionName,city";
            
            $context = stream_context_create([
                'http' => [
                    'timeout' => 3, // 3 second timeout
                    'ignore_errors' => true
                ]
            ]);
            
            $response = @file_get_contents($url, false, $context);
            
            if ($response === false) {
                return 'Unknown Location';
            }
            
            $data = json_decode($response, true);
            
            if (isset($data['status']) && $data['status'] === 'success') {
                $location = [];
                
                if (!empty($data['city'])) {
                    $location[] = $data['city'];
                }
                
                if (!empty($data['regionName'])) {
                    $location[] = $data['regionName'];
                }
                
                if (!empty($data['country'])) {
                    $location[] = $data['country'];
                }
                
                return !empty($location) ? implode(', ', $location) : 'Unknown Location';
            }
            
            return 'Unknown Location';
        } catch (\Exception $e) {
            Log::error('Failed to get location from IP: ' . $e->getMessage());
            return 'Unknown Location';
        }
    }
    
    /**
     * Check if device verification is needed
     *
     * @param  int  $userId
     * @param  string  $macAddress
     * @param  string  $ipAddress
     * @param  string  $location
     * @return bool
     */
    private function checkIfDeviceVerificationNeeded($userId, $macAddress, $ipAddress, $location)
    {
        // Check if user has any login history
        $hasLoginHistory = users_login::where('users_id', $userId)
            ->where('status', 'login')
            ->exists();
        
        // First time login - needs verification
        if (!$hasLoginHistory) {
            Log::info("First time login detected for user {$userId}");
            return true;
        }
        
        // Check if this exact device has been used before
        $knownDevice = users_login::where('users_id', $userId)
            ->where('mac_address', $macAddress)
            ->where('status', 'login')
            ->exists();
        
        if ($knownDevice) {
            Log::info("Known device detected for user {$userId}");
            return false; // Known device, no verification needed
        }
        
        // Check if IP or location is significantly different
        $recentLogins = users_login::where('users_id', $userId)
            ->where('status', 'login')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
        
        $knownIp = $recentLogins->contains('ip_address', $ipAddress);
        $knownLocation = $recentLogins->contains('location', $location);
        
        if (!$knownIp && !$knownLocation) {
            Log::info("New device/location detected for user {$userId}: IP={$ipAddress}, Location={$location}");
            return true; // New device AND new location
        }
        
        return false; // Similar device/location, allow login
    }
    
    /**
     * Generate and send OTP to user email
     *
     * @param  User  $user
     * @param  string  $macAddress
     * @param  string  $ipAddress
     * @param  string  $location
     * @return string
     */
    private function generateAndSendOTP($user, $macAddress, $ipAddress, $location)
    {
        // Generate 6-digit OTP
        $otpCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Set expiration time (10 minutes from now)
        $expireAt = Carbon::now()->addMinutes(10);
        
        // Save OTP to database
        tbl_otp::create([
            'user_id' => $user->id,
            'email' => $user->email,
            'otp_code' => $otpCode,
            'status' => tbl_otp::STATUS_NOT_USED,
            'expire_at' => $expireAt
        ]);
        
        // Prepare email data
        $deviceInfo = [
            'mac_address' => $macAddress,
            'ip_address' => $ipAddress,
            'location' => $location,
            'browser' => request()->header('User-Agent'),
            'date_time' => Carbon::now()->format('F d, Y g:i A')
        ];
        
        // Send email with OTP
        try {
            Mail::send('emails.device-verification', [
                'user' => $user,
                'otp_code' => $otpCode,
                'device_info' => $deviceInfo,
                'expire_minutes' => 10
            ], function ($message) use ($user) {
                $message->to($user->email, $user->name)
                    ->subject('New Device Login - Verification Required');
            });
            
            Log::info("OTP sent to {$user->email} for device verification");
        } catch (\Exception $e) {
            Log::error("Failed to send OTP email: " . $e->getMessage());
        }
        
        return $otpCode;
    }
    
    /**
     * Verify OTP and complete login
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function verifyOTP(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'otp_code' => 'required|string|size:6'
        ]);
        
        // Find the user
        $user = User::findOrFail($request->user_id);
        
        // Check if user is active
        if ((int) $user->active !== 1) {
            try {
                $user->logCustom("OTP verification blocked for inactive user: {$user->name} ({$user->email})");
            } catch (\Exception $e) {
                Log::error('Failed to log inactive user OTP attempt: ' . $e->getMessage());
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Your account has been deactivated. Please contact the administrator.'
            ], 403);
        }
        
        // Find the OTP
        $otp = tbl_otp::where('user_id', $user->id)
            ->where('otp_code', $request->otp_code)
            ->where('status', tbl_otp::STATUS_NOT_USED)
            ->orderBy('created_at', 'desc')
            ->first();
        
        if (!$otp) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification code.'
            ], 422);
        }
        
        // Check if OTP is expired
        if ($otp->isExpired()) {
            $otp->markAsExpired();
            return response()->json([
                'success' => false,
                'message' => 'Verification code has expired. Please request a new one.'
            ], 422);
        }
        
        // Mark OTP as used
        $otp->markAsUsed();
        
        // Log the user in
        Auth::login($user);
        
        // Get device information
        $publicIp = $request->input('public_ip');
        $ipAddress = $publicIp ?: $request->ip();
        $macAddress = $request->input('mac_address', 'N/A');
        $browser = $this->getBrowserInfo($request);
        $location = $this->getLocationFromIP($ipAddress);
        
        try {
            // Set user as online
            $user->is_online = 1;
            $user->save();
            
            // Save login information
            users_login::create([
                'users_id' => $user->id,
                'browser' => $browser,
                'ip_address' => $ipAddress,
                'mac_address' => $macAddress,
                'location' => $location,
                'status' => 'login'
            ]);
            
            // Log successful login
            $user->logCustom("User logged in successfully from new device: {$user->name} ({$user->email}) - IP: {$ipAddress}, Location: {$location}");
            
            // Send welcome notification
            $user->notifySuccess(
                'Welcome Back!', 
                "Hello {$user->name}, you have successfully logged in from a new device."
            );
            
            // Send security alert email
            $this->sendSecurityAlert($user, $macAddress, $ipAddress, $location, $browser);
            
        } catch (\Exception $e) {
            Log::error('Failed to save login information after OTP verification: ' . $e->getMessage());
        }
        
        $request->session()->regenerate();
        
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'name' => $user->name,
                'email' => $user->email
            ]
        ]);
    }
    
    /**
     * Send security alert email for new device login
     *
     * @param  User  $user
     * @param  string  $macAddress
     * @param  string  $ipAddress
     * @param  string  $location
     * @param  string  $browser
     * @return void
     */
    private function sendSecurityAlert($user, $macAddress, $ipAddress, $location, $browser)
    {
        try {
            $deviceInfo = [
                'mac_address' => $macAddress,
                'ip_address' => $ipAddress,
                'location' => $location,
                'browser' => $browser,
                'date_time' => Carbon::now()->format('F d, Y g:i A')
            ];
            
            Mail::send('emails.new-device-alert', [
                'user' => $user,
                'device_info' => $deviceInfo
            ], function ($message) use ($user) {
                $message->to($user->email, $user->name)
                    ->subject('Security Alert: New Device Login Detected');
            });
            
            Log::info("Security alert sent to {$user->email} for new device login");
        } catch (\Exception $e) {
            Log::error("Failed to send security alert email: " . $e->getMessage());
        }
    }
}

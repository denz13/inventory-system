<?php

namespace App\Http\Controllers;

use App\Http\Request\LoginRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\tbl_announcement;

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
        if (!Auth::attempt([
            'email' => $request->email,
            'password' => $request->password
        ])) {
            return response()->json([
                'success' => false,
                'message' => 'Wrong email or password.'
            ], 422);
        }

        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Login successful'
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
        Auth::logout();
        return redirect('login');
    }
}

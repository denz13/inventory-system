<?php

namespace App\Http\Controllers\users_login;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\users_login;

class UsersloginController extends Controller
{
    public function index()
    {
        // Get per_page from request, default to 10
        $perPage = request('per_page', 10);
        
        // Get all user login activities with user relationship, ordered by most recent
        $usersLogin = users_login::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return view('users_login.users_login', compact('usersLogin'));
    }

    public function show($id)
    {
        try {
            $userLogin = users_login::with('user')->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $userLogin
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User login record not found'
            ], 404);
        }
    }
}

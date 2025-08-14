<?php

namespace App\Http\Controllers\businessmanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\business_management_list as Business;
use App\Models\User;
use Illuminate\Validation\Rule;

class BusinessManagementController extends Controller
{
    public function index()
    {
        $businesses = Business::with('user')->latest()->paginate(12);
        $owners = User::select('id','name')->orderBy('name')->get();
        return view('business-management.business-management', compact('businesses','owners'));
    }

    public function show(Business $business)
    {
        return response()->json($business->load('user'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'type_of_business' => ['required', 'string', 'max:255'],
            'business_name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['active','inactive'])],
        ]);

        $business = Business::create($validated);
        return response()->json(['message' => 'Business saved', 'id' => $business->id], 201);
    }

    public function update(Request $request, Business $business)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'type_of_business' => ['required', 'string', 'max:255'],
            'business_name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['active','inactive'])],
        ]);

        $business->update($validated);
        return response()->json(['message' => 'Business updated']);
    }

    public function destroy(Business $business)
    {
        $business->delete();
        return response()->json(['message' => 'Business deleted']);
    }
}



<?php

namespace App\Http\Controllers\businessmanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\business_management_list as Business;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class BusinessManagementController extends Controller
{
    public function __construct()
    {
        \Log::info('BusinessManagementController instantiated');
    }

    public function index()
    {
        \Log::info('BusinessManagementController index method called');
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
            'business_clearance' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
            'address' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['pending', 'approved', 'declined'])],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        // Handle file upload
        if ($request->hasFile('business_clearance')) {
            $file = $request->file('business_clearance');
            $filename = 'clearance_' . time() . '_' . $request->user_id . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('business-clearances', $filename, 'public');
            $validated['business_clearance'] = $filename;
        }

        // Set default status to pending if not provided
        if (!isset($validated['status'])) {
            $validated['status'] = 'pending';
        }

        $business = Business::create($validated);
        return response()->json(['message' => 'Business saved', 'id' => $business->id], 201);
    }

    public function update(Request $request, Business $business)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'type_of_business' => ['required', 'string', 'max:255'],
            'business_name' => ['required', 'string', 'max:255'],
            'business_clearance' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
            'address' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['pending', 'approved', 'declined'])],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        // Handle file upload
        if ($request->hasFile('business_clearance')) {
            // Delete old file if exists
            if ($business->business_clearance) {
                Storage::disk('public')->delete('business-clearances/' . $business->business_clearance);
            }
            
            $file = $request->file('business_clearance');
            $filename = 'clearance_' . time() . '_' . $request->user_id . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('business-clearances', $filename, 'public');
            $validated['business_clearance'] = $filename;
        }

        $business->update($validated);
        return response()->json(['message' => 'Business updated']);
    }

    public function updateStatus(Request $request, Business $business)
    {
        try {
            \Log::info('updateStatus method called', [
                'business_id' => $business->id ?? 'null',
                'business_exists' => $business ? 'yes' : 'no',
                'request_data' => $request->all(),
                'request_method' => $request->method(),
                'user_id' => auth()->id()
            ]);
            
            $validated = $request->validate([
                'status' => ['required', Rule::in(['pending', 'approved', 'declined'])],
                'reason' => ['nullable', 'string', 'max:500'],
            ]);
            
            \Log::info('Validation passed', ['validated_data' => $validated]);
            
            $business->status = $validated['status'];
            if (isset($validated['reason'])) {
                $business->reason = $validated['reason'];
            }
            
            \Log::info('About to save business', [
                'business_id' => $business->id,
                'new_status' => $business->status,
                'new_reason' => $business->reason ?? 'null'
            ]);
            
            $business->save();
            
            \Log::info('Business saved successfully', [
                'business_id' => $business->id,
                'updated_status' => $business->status
            ]);
            
            return response()->json([
                'message' => 'Business status updated successfully',
                'business' => $business->fresh()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating business status: ' . $e->getMessage(), [
                'business_id' => $business->id ?? 'null',
                'exception' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Error updating business status: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Business $business)
    {
        // Delete associated file if exists
        if ($business->business_clearance) {
            Storage::disk('public')->delete('business-clearances/' . $business->business_clearance);
        }
        
        $business->delete();
        return response()->json(['message' => 'Business deleted']);
    }
}



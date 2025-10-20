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
        
        // Get per_page from request, default to 12
        $perPage = request('per_page', 12);
        
        $businesses = Business::with('user')->latest()->paginate($perPage);
        $owners = User::select('id','name')->orderBy('name')->get();
        
        // Get unique statuses from database
        $statuses = Business::select('status')
            ->distinct()
            ->whereNotNull('status')
            ->pluck('status')
            ->sort()
            ->values();
        
        return view('business-management.business-management', compact('businesses', 'owners', 'statuses'));
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
            // Store file and save full path in database
            $path = $file->storeAs('business-clearances', $filename, 'public');
            $validated['business_clearance'] = $path; // Store full path: business-clearances/filename
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
            if ($business->business_clearance && Storage::disk('public')->exists($business->business_clearance)) {
                Storage::disk('public')->delete($business->business_clearance);
            }
            
            $file = $request->file('business_clearance');
            $filename = 'clearance_' . time() . '_' . $request->user_id . '.' . $file->getClientOriginalExtension();
            // Store file and save full path in database
            $path = $file->storeAs('business-clearances', $filename, 'public');
            $validated['business_clearance'] = $path; // Store full path: business-clearances/filename
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
            
            $oldStatus = $business->status;
            $business->status = $validated['status'];
            if (isset($validated['reason'])) {
                $business->reason = $validated['reason'];
            }
            
            \Log::info('About to save business', [
                'business_id' => $business->id,
                'old_status' => $oldStatus,
                'new_status' => $business->status,
                'new_reason' => $business->reason ?? 'null'
            ]);
            
            $business->save();
            
            \Log::info('Business saved successfully', [
                'business_id' => $business->id,
                'updated_status' => $business->status
            ]);
            
            // Send notification to business owner about status change
            if ($business->user && $oldStatus !== $business->status) {
                $this->notifyBusinessOwner($business, $validated['status'], $validated['reason'] ?? null);
            }
            
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

    /**
     * Send notification to business owner about status change
     */
    private function notifyBusinessOwner(Business $business, string $newStatus, ?string $reason = null)
    {
        try {
            // Get the "apply business" module
            $module = \App\Models\module::where('module_name', 'apply business')->first();
            
            if (!$module) {
                \Log::warning('apply business module not found for owner notification');
                return;
            }

            $title = '';
            $message = '';
            $type = 'info';

            if ($newStatus === 'approved') {
                $title = 'Business Approved';
                $message = "Your business '{$business->business_name}' has been approved!";
                $type = 'success';
            } elseif ($newStatus === 'declined') {
                $title = 'Business Declined';
                $message = "Your business '{$business->business_name}' has been declined.";
                if ($reason) {
                    $message .= " Reason: {$reason}";
                }
                $type = 'error';
            } else {
                $title = 'Business Status Updated';
                $message = "Your business '{$business->business_name}' status has been changed to {$newStatus}.";
                $type = 'info';
            }

            // Send notification to the business owner
            $business->user->sendCustomNotification($type, $title, $message, $module->id);
            
            \Log::info('Notification sent to business owner', [
                'business_id' => $business->id,
                'owner_id' => $business->user->id,
                'owner_name' => $business->user->name,
                'status' => $newStatus
            ]);

        } catch (\Exception $e) {
            \Log::error('Error sending notification to business owner', [
                'business_id' => $business->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function destroy(Business $business)
    {
        // Delete associated file if exists
        if ($business->business_clearance && Storage::disk('public')->exists($business->business_clearance)) {
            Storage::disk('public')->delete($business->business_clearance);
        }
        
        $business->delete();
        return response()->json(['message' => 'Business deleted']);
    }
}



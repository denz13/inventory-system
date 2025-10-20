<?php

namespace App\Http\Controllers\billingmanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_billing_management;
use App\Models\tbl_billing_management_list;
use App\Models\User;
use App\Models\Notification;
use App\Models\notification_settings;
use App\Models\module;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class BillingManagementController extends Controller
{
    public function index()
    {
        $billings = tbl_billing_management::with(['user', 'billingItems'])->paginate(10);
        $users = User::all();
        
        // Get distinct roles from users table
        $roles = User::select('role')
            ->distinct()
            ->whereNotNull('role')
            ->where('role', '!=', '')
            ->orderBy('role')
            ->pluck('role');
        
        return view('billing-management.billing-management', compact('billings', 'users', 'roles'));
    }

    /**
     * Get user's billing date range based on registration or reactivation
     */
    public function getUserBillingDateRange($userId)
    {
        try {
            $user = User::findOrFail($userId);
            
            // Determine if user was reactivated by checking if updated_at is significantly after created_at
            $createdAt = Carbon::parse($user->created_at);
            $updatedAt = Carbon::parse($user->updated_at);
            
            // If updated_at is more than 1 day after created_at, consider it a reactivation
            $isReactivated = $updatedAt->diffInDays($createdAt) > 1;
            
            // Use updated_at for reactivated users, created_at for new registrations
            $startDate = $isReactivated ? $updatedAt : $createdAt;
            
            // Calculate billing date range (1 month span from the exact start date)
            $billingStartDate = $startDate->copy(); // Start from the exact date
            $billingEndDate = $startDate->copy()->addMonth()->subDay(); // End one month later minus 1 day
            
            // Format dates for display
            $formattedStartDate = $billingStartDate->format('d M, Y');
            $formattedEndDate = $billingEndDate->format('d M, Y');
            
            \Log::info('User billing date range calculated', [
                'user_id' => $userId,
                'user_name' => $user->name,
                'created_at' => $createdAt->format('Y-m-d H:i:s'),
                'updated_at' => $updatedAt->format('Y-m-d H:i:s'),
                'is_reactivated' => $isReactivated,
                'base_date' => $startDate->format('Y-m-d H:i:s'),
                'billing_start' => $formattedStartDate,
                'billing_end' => $formattedEndDate,
                'billing_days' => $billingStartDate->diffInDays($billingEndDate) + 1
            ]);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'user_id' => $userId,
                    'user_name' => $user->name,
                    'start_date' => $formattedStartDate,
                    'end_date' => $formattedEndDate,
                    'date_range' => $formattedStartDate . ' - ' . $formattedEndDate,
                    'is_reactivated' => $isReactivated,
                    'base_date' => $startDate->format('Y-m-d H:i:s'),
                    'registration_date' => $createdAt->format('M d, Y'),
                    'last_update_date' => $updatedAt->format('M d, Y')
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error getting user billing date range', [
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error calculating billing date range: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get users who have notification settings for billing management
     */
    private function getBillingManagementNotificationUsers()
    {
        try {
            // Find the billing management module
            $billingModule = module::where('module_name', 'billing management')->first();
            
            if (!$billingModule) {
                \Log::warning('Billing management module not found');
                return collect();
            }

            // Get users with notification settings for billing management
            $notificationSettings = notification_settings::where('module_id', $billingModule->id)
                ->where('status', 'active')
                ->with('user')
                ->get();

            return $notificationSettings->map(function ($setting) {
                return $setting->user;
            })->filter(); // Remove any null users

        } catch (\Exception $e) {
            \Log::error('Error getting billing management notification users: ' . $e->getMessage());
            return collect();
        }
    }

    /**
     * Send notifications to billing management users
     */
    private function sendBillingManagementNotifications($billing, $message)
    {
        try {
            \Log::info('Starting billing management notifications', [
                'billing_id' => $billing->id,
                'current_user_id' => Auth::id(),
                'current_user_name' => Auth::user()->name ?? 'N/A'
            ]);

            $users = $this->getBillingManagementNotificationUsers();
            
            \Log::info('Users to notify', [
                'total_users_found' => $users->count(),
                'user_ids' => $users->pluck('id')->toArray(),
                'user_names' => $users->pluck('name')->toArray()
            ]);
            
            $notificationsSent = 0;
            foreach ($users as $user) {
                // Skip the user who created the billing
                if ($user->id === Auth::id()) {
                    \Log::info('Skipping notification for billing creator', [
                        'user_id' => $user->id,
                        'user_name' => $user->name
                    ]);
                    continue;
                }

                try {
                    // Get billing management module ID for notification_settings_id
                    $billingModule = module::where('module_name', 'billing management')->first();
                    $moduleId = $billingModule ? $billingModule->id : null;
                    
                    // Send notification to billing management users
                    $notification = $user->notifyInfo(
                        'New Billing Created',
                        Auth::user()->name . " has created a new billing for " . $billing->user->name . " - Amount: ₱" . number_format($billing->amount_due, 2) . " for Bill #" . str_pad($billing->id, 6, '0', STR_PAD_LEFT) . ". " . $message,
                        $moduleId
                    );

                    \Log::info('Billing management notification sent successfully', [
                        'notification_id' => $notification->id,
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'billing_id' => $billing->id
                    ]);

                    $notificationsSent++;

                } catch (\Exception $e) {
                    \Log::error('Error sending notification to user', [
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'error' => $e->getMessage(),
                        'billing_id' => $billing->id
                    ]);
                }
            }

            \Log::info('Billing management notifications completed', [
                'billing_id' => $billing->id,
                'total_users_found' => $users->count(),
                'notifications_sent' => $notificationsSent
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in sendBillingManagementNotifications', [
                'error' => $e->getMessage(),
                'billing_id' => $billing->id ?? 'N/A',
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'billing_date_range' => 'required|string',
                'billing_items' => 'required|array|min:1',
                'billing_items.*.description' => 'required|string|max:255',
                'billing_items.*.qty' => 'required|integer|min:1',
                'billing_items.*.price' => 'required|numeric|min:0'
            ]);

            // Use the date range directly from the picker
            $dateRange = $validated['billing_date_range'];

            // Calculate total amount from billing items
            $totalAmount = 0;
            foreach ($validated['billing_items'] as $item) {
                $totalAmount += $item['qty'] * $item['price'];
            }

            $billing = tbl_billing_management::create([
                'user_id' => $validated['user_id'],
                'billing_date' => $dateRange, // Store as date range string
                'receipt' => null, // No receipt number for now
                'amount_due' => $totalAmount,
                'status' => 'sent to owners'
            ]);

            // Create billing items
            foreach ($validated['billing_items'] as $item) {
                tbl_billing_management_list::create([
                    'billing_management_id' => $billing->id,
                    'description' => $item['description'],
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                    'is_pay' => 'No' // Default to not paid
                ]);
            }

            // Activity logging for billing creation
            try {
                Auth::user()->logCustom(
                    "Created new billing for " . $billing->user->name . 
                    " - Amount: ₱" . number_format($billing->amount_due, 2) . 
                    " - Bill #" . str_pad($billing->id, 6, '0', STR_PAD_LEFT) . 
                    " - Status: " . $billing->status
                );
                \Log::info('Billing creation activity logged successfully', [
                    'user_id' => Auth::id(),
                    'billing_id' => $billing->id
                ]);
            } catch (\Exception $e) {
                \Log::error('Error logging billing creation activity: ' . $e->getMessage());
            }

            // Send notification to the user who the billing is for
            try {
                // Get billing management module ID for notification_settings_id
                $billingModule = module::where('module_name', 'billing management')->first();
                $moduleId = $billingModule ? $billingModule->id : null;
                
                // NOTIFICATION 1: For the user who the billing is for
                $userNotification = $billing->user->notifyInfo(
                    'New Billing Created',
                    'A new billing has been created for you - Amount: ₱' . number_format($billing->amount_due, 2) . ' for Bill #' . str_pad($billing->id, 6, '0', STR_PAD_LEFT) . '. Please check your billing details and make payment when ready.',
                    $moduleId
                );

                \Log::info('User billing notification sent successfully', [
                    'notification_id' => $userNotification->id,
                    'user_id' => $billing->user->id,
                    'billing_id' => $billing->id
                ]);
            } catch (\Exception $e) {
                \Log::error('Error sending billing notification to user: ' . $e->getMessage());
            }

            // Send notifications to billing management users
            try {
                $this->sendBillingManagementNotifications($billing, 'Billing has been created and sent to the user.');
                \Log::info('Billing management notifications sent successfully');
            } catch (\Exception $e) {
                \Log::error('Failed to send billing management notifications: ' . $e->getMessage());
            }

            return response()->json([
                'message' => 'Billing created successfully',
                'billing' => $billing->load(['user', 'billingItems'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating billing: ' . $e->getMessage(),
                'error' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function show($id)
    {
        $billing = tbl_billing_management::with(['user', 'billingItems'])->findOrFail($id);
        
        return response()->json([
            'billing' => $billing
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $billing = tbl_billing_management::findOrFail($id);
            
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'billing_date_range' => 'required|string',
                'billing_items' => 'required|array|min:1',
                'billing_items.*.description' => 'required|string|max:255',
                'billing_items.*.qty' => 'required|integer|min:1',
                'billing_items.*.price' => 'required|numeric|min:0'
            ]);

            // Use the date range directly from the picker
            $dateRange = $validated['billing_date_range'];

            // Calculate total amount from billing items
            $totalAmount = 0;
            foreach ($validated['billing_items'] as $item) {
                $totalAmount += $item['qty'] * $item['price'];
            }
            
            $billing->update([
                'user_id' => $validated['user_id'],
                'billing_date' => $dateRange, // Store as date range string
                'amount_due' => $totalAmount
            ]);

            // Delete old billing items and create new ones
            $billing->billingItems()->delete();
            foreach ($validated['billing_items'] as $item) {
                tbl_billing_management_list::create([
                    'billing_management_id' => $billing->id,
                    'description' => $item['description'],
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                    'is_pay' => 'No' // Default to not paid
                ]);
            }

            // Activity logging for billing update
            try {
                Auth::user()->logCustom(
                    "Updated billing for " . $billing->user->name . 
                    " - Amount: ₱" . number_format($billing->amount_due, 2) . 
                    " - Bill #" . str_pad($billing->id, 6, '0', STR_PAD_LEFT)
                );
                \Log::info('Billing update activity logged successfully', [
                    'user_id' => Auth::id(),
                    'billing_id' => $billing->id
                ]);
            } catch (\Exception $e) {
                \Log::error('Error logging billing update activity: ' . $e->getMessage());
            }
            
            return response()->json([
                'message' => 'Billing updated successfully',
                'billing' => $billing->load(['user', 'billingItems'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating billing: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $billing = tbl_billing_management::with('user')->findOrFail($id);
        
        // Activity logging for billing deletion
        try {
            Auth::user()->logCustom(
                "Deleted billing for " . $billing->user->name . 
                " - Amount: ₱" . number_format($billing->amount_due, 2) . 
                " - Bill #" . str_pad($billing->id, 6, '0', STR_PAD_LEFT)
            );
            \Log::info('Billing deletion activity logged successfully', [
                'user_id' => Auth::id(),
                'billing_id' => $billing->id
            ]);
        } catch (\Exception $e) {
            \Log::error('Error logging billing deletion activity: ' . $e->getMessage());
        }

        $billing->delete();

        return response()->json([
            'message' => 'Billing deleted successfully'
        ]);
    }
}

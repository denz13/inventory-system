<?php

namespace App\Http\Controllers\listpayments;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_billing_management;
use App\Models\tbl_billing_management_list;
use App\Models\Notification;
use App\Models\notification_settings;
use App\Models\module;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ListPaymentsController extends Controller
{
    public function index()
    {
        // Get all billing records with user relationship only (safe)
        $payments = tbl_billing_management::with(['user'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return view('list-payments.list-of-payments', compact('payments'));
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
    private function sendBillingManagementNotifications($billing, $action, $message)
    {
        try {
            \Log::info('Starting billing management notifications', [
                'billing_id' => $billing->id,
                'action' => $action,
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
                // Skip the user who made the action
                if ($user->id === Auth::id()) {
                    \Log::info('Skipping notification for action maker', [
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
                        'Payment ' . ucfirst($action),
                        Auth::user()->name . " has " . $action . "d a payment for " . $billing->user->name . " - Amount: ₱" . number_format($billing->amount_due, 2) . " for Bill #" . str_pad($billing->id, 6, '0', STR_PAD_LEFT) . ". " . $message,
                        $moduleId
                    );

                    \Log::info('Billing management notification sent successfully', [
                        'notification_id' => $notification->id,
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'billing_id' => $billing->id,
                        'action' => $action
                    ]);

                    $notificationsSent++;

                } catch (\Exception $e) {
                    \Log::error('Error sending notification to user', [
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'error' => $e->getMessage(),
                        'billing_id' => $billing->id,
                        'action' => $action
                    ]);
                }
            }

            \Log::info('Billing management notifications completed', [
                'billing_id' => $billing->id,
                'action' => $action,
                'total_users_found' => $users->count(),
                'notifications_sent' => $notificationsSent
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in sendBillingManagementNotifications', [
                'error' => $e->getMessage(),
                'billing_id' => $billing->id ?? 'N/A',
                'action' => $action ?? 'N/A',
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    public function show($id)
    {
        try {
            // Get billing with all relationships for detailed view
            $billing = tbl_billing_management::with(['user', 'billingItems'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'billing' => $billing
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Billing record not found'
            ], 404);
        }
    }

    public function approve(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            
            $billing = tbl_billing_management::with('user')->findOrFail($id);
            
            // Update status to approved
            $billing->update([
                'status' => 'approved',
                'reason' => null // Clear any previous rejection reason
            ]);

            // Update all billing items to mark as paid
            $billing->billingItems()->update([
                'is_pay' => 'yes'
            ]);

            DB::commit();

            // Activity logging for payment approval
            try {
                Auth::user()->logCustom(
                    "Approved payment for " . $billing->user->name . 
                    " - Amount: ₱" . number_format($billing->amount_due, 2) . 
                    " - Bill #" . str_pad($billing->id, 6, '0', STR_PAD_LEFT)
                );
                \Log::info('Payment approval activity logged successfully', [
                    'user_id' => Auth::id(),
                    'billing_id' => $billing->id
                ]);
            } catch (\Exception $e) {
                \Log::error('Error logging payment approval activity: ' . $e->getMessage());
            }

            // Send notification to the user who made the payment
            try {
                // Get billing management module ID for notification_settings_id
                $billingModule = module::where('module_name', 'billing management')->first();
                $moduleId = $billingModule ? $billingModule->id : null;
                
                // NOTIFICATION 1: For the user who made the payment
                $userNotification = $billing->user->notifySuccess(
                    'Payment Approved',
                    'Your payment of ₱' . number_format($billing->amount_due, 2) . ' for Bill #' . str_pad($billing->id, 6, '0', STR_PAD_LEFT) . ' has been approved and processed successfully.',
                    $moduleId
                );

                \Log::info('User payment approval notification sent successfully', [
                    'notification_id' => $userNotification->id,
                    'user_id' => $billing->user->id,
                    'billing_id' => $billing->id
                ]);
            } catch (\Exception $e) {
                \Log::error('Error sending payment approval notification to user: ' . $e->getMessage());
            }

            // Send notifications to billing management users
            try {
                $this->sendBillingManagementNotifications($billing, 'approved', 'Payment has been approved and processed.');
                \Log::info('Billing management notifications sent successfully for approval');
            } catch (\Exception $e) {
                \Log::error('Failed to send billing management notifications for approval: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment approved successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve payment'
            ], 500);
        }
    }

    public function reject(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            
            $billing = tbl_billing_management::with('user')->findOrFail($id);
            
            // Get rejection reason from request
            $reason = $request->input('reason', '');
            
            // Update status to rejected and save reason
            $billing->update([
                'status' => 'rejected',
                'reason' => $reason
            ]);

            // Update all billing items to mark as not paid
            $billing->billingItems()->update([
                'is_pay' => 'no'
            ]);

            DB::commit();

            // Activity logging for payment rejection
            try {
                $logMessage = "Rejected payment for " . $billing->user->name . 
                    " - Amount: ₱" . number_format($billing->amount_due, 2) . 
                    " - Bill #" . str_pad($billing->id, 6, '0', STR_PAD_LEFT);
                
                if ($reason) {
                    $logMessage .= " - Reason: " . $reason;
                }
                
                Auth::user()->logCustom($logMessage);
                \Log::info('Payment rejection activity logged successfully', [
                    'user_id' => Auth::id(),
                    'billing_id' => $billing->id
                ]);
            } catch (\Exception $e) {
                \Log::error('Error logging payment rejection activity: ' . $e->getMessage());
            }

            // Send notification to the user who made the payment
            try {
                // Get billing management module ID for notification_settings_id
                $billingModule = module::where('module_name', 'billing management')->first();
                $moduleId = $billingModule ? $billingModule->id : null;
                
                // NOTIFICATION 1: For the user who made the payment
                $notificationMessage = 'Your payment of ₱' . number_format($billing->amount_due, 2) . ' for Bill #' . str_pad($billing->id, 6, '0', STR_PAD_LEFT) . ' has been rejected.';
                
                if ($reason) {
                    $notificationMessage .= ' Reason: ' . $reason;
                }
                
                $userNotification = $billing->user->notifyError(
                    'Payment Rejected',
                    $notificationMessage,
                    $moduleId
                );

                \Log::info('User payment rejection notification sent successfully', [
                    'notification_id' => $userNotification->id,
                    'user_id' => $billing->user->id,
                    'billing_id' => $billing->id
                ]);
            } catch (\Exception $e) {
                \Log::error('Error sending payment rejection notification to user: ' . $e->getMessage());
            }

            // Send notifications to billing management users
            try {
                $rejectionMessage = 'Payment has been rejected.' . ($reason ? ' Reason: ' . $reason : '');
                $this->sendBillingManagementNotifications($billing, 'rejected', $rejectionMessage);
                \Log::info('Billing management notifications sent successfully for rejection');
            } catch (\Exception $e) {
                \Log::error('Failed to send billing management notifications for rejection: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment rejected successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject payment'
            ], 500);
        }
    }
}

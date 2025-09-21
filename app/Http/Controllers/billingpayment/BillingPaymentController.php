<?php

namespace App\Http\Controllers\billingpayment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_billing_management;
use App\Models\tbl_bank_account_type;
use App\Models\tbl_bank_account_category;
use App\Models\Notification;
use App\Models\notification_settings;
use App\Models\module;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class BillingPaymentController extends Controller
{
    public function index()
    {
        // Get current logged-in user's billings
        $userBillings = tbl_billing_management::with(['billingItems'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Get bank account types and categories for payment modal
        $bankAccountTypes = tbl_bank_account_type::where('status', 'Active')->get();
        $bankAccountCategories = tbl_bank_account_category::with('bankAccountType')
            ->where('status', 'Active')
            ->get();

        return view('billing-payment.billing-payment', compact('userBillings', 'bankAccountTypes', 'bankAccountCategories'));
    }

    /**
     * Get users who have notification settings for billing management module
     */
    private function getBillingManagementNotificationUsers()
    {
        // First, let's check all available modules to see what's in the database
        $allModules = module::all();
        \Log::info('All modules in database', [
            'modules' => $allModules->map(function($module) {
                return [
                    'id' => $module->id,
                    'name' => $module->module_name,
                    'status' => $module->status
                ];
            })
        ]);

        // Try different variations of the module name
        $possibleModuleNames = [
            'billing management',
            'Billing Management',
            'Billing management',
            'billing_management',
            'Billing_Management'
        ];

        $billingModule = null;
        foreach ($possibleModuleNames as $moduleName) {
            $billingModule = module::where('module_name', $moduleName)
                ->where('status', 'active')
                ->first();
            
            if ($billingModule) {
                \Log::info('Found billing module with name', [
                    'module_name' => $moduleName,
                    'module_id' => $billingModule->id
                ]);
                break;
            }
        }

        \Log::info('Billing module lookup result', [
            'module_found' => $billingModule ? true : false,
            'module_id' => $billingModule->id ?? 'N/A',
            'module_name' => $billingModule->module_name ?? 'N/A',
            'module_status' => $billingModule->status ?? 'N/A'
        ]);

        if (!$billingModule) {
            \Log::warning('Billing management module not found or inactive. Available modules:', [
                'available_modules' => $allModules->pluck('module_name')->toArray()
            ]);
            return collect();
        }

        // Get users with active notification settings for billing management
        $notificationSettings = notification_settings::with('user')
            ->where('module_id', $billingModule->id)
            ->where('status', 'active')
            ->get();

        \Log::info('Notification settings found', [
            'settings_count' => $notificationSettings->count(),
            'settings' => $notificationSettings->map(function($setting) {
                return [
                    'id' => $setting->id,
                    'user_id' => $setting->users_id,
                    'user_name' => $setting->user->name ?? 'N/A',
                    'status' => $setting->status
                ];
            })
        ]);

        return $notificationSettings->pluck('user')->filter(); // Remove null users
    }

    /**
     * Send notification to users with billing management notification settings
     */
    private function sendBillingManagementNotifications($billing, $paymentAccount, $message)
    {
        try {
            \Log::info('Starting billing management notifications', [
                'billing_id' => $billing->id,
                'current_user_id' => Auth::id(),
                'current_user_name' => Auth::user()->name ?? 'N/A',
                'payment_account' => $paymentAccount->account_name ?? 'N/A'
            ]);

            $users = $this->getBillingManagementNotificationUsers();
            
            \Log::info('Users to notify', [
                'total_users_found' => $users->count(),
                'user_ids' => $users->pluck('id')->toArray(),
                'user_names' => $users->pluck('name')->toArray()
            ]);
            
            $notificationsSent = 0;
            foreach ($users as $user) {
                // Skip the user who made the payment
                if ($user->id === Auth::id()) {
                    \Log::info('Skipping notification for payment maker', [
                        'user_id' => $user->id,
                        'user_name' => $user->name
                    ]);
                    continue;
                }

                try {
                    // Get billing management module ID for notification_settings_id
                    $billingModule = module::where('module_name', 'billing management')->first();
                    $moduleId = $billingModule ? $billingModule->id : null;
                    
                    // NOTIFICATION 2: For users with notification_settings (info notification about someone else's payment)
                    $notification = $user->notifyInfo(
                        'New Payment Submitted',
                        Auth::user()->name . " has submitted a payment of ₱" . number_format($billing->amount_due, 2) . " for Bill #" . str_pad($billing->id, 6, '0', STR_PAD_LEFT) . ". Payment method: " . ($paymentAccount->account_name ?? 'N/A') . ". " . $message,
                        $moduleId
                    );

                    \Log::info('Notification sent successfully', [
                        'notification_id' => $notification->id,
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'notification_title' => 'New Payment Received'
                    ]);

                    $notificationsSent++;
                } catch (\Exception $notificationError) {
                    \Log::error('Error sending notification to user', [
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'error' => $notificationError->getMessage()
                    ]);
                }
            }

            \Log::info('Billing management notifications completed', [
                'billing_id' => $billing->id,
                'total_users_found' => $users->count(),
                'notifications_sent' => $notificationsSent,
                'payment_account' => $paymentAccount->account_name ?? 'N/A'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in sendBillingManagementNotifications', [
                'error' => $e->getMessage(),
                'billing_id' => $billing->id ?? 'N/A',
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    public function processPayment(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'billing_id' => 'required|exists:tbl_billing_management,id',
                'account_id' => 'required|exists:tbl_bank_account_category,id',
                'payment_file' => 'required|file|mimes:jpeg,png,gif,webp,pdf,doc,docx|max:10240', // 10MB max
            ]);

            // Find the billing record
            $billing = tbl_billing_management::findOrFail($request->billing_id);
            
            // Debug information - before conversion
            $originalCurrentUserId = Auth::id();
            $originalBillingUserId = $billing->user_id;
            
            \Log::info('Payment processing debug', [
                'original_current_user_id' => $originalCurrentUserId,
                'original_billing_user_id' => $originalBillingUserId,
                'billing_id' => $request->billing_id,
                'authenticated' => Auth::check()
            ]);
            
            // Verify that the billing belongs to the authenticated user
            // Convert both to integers to ensure proper comparison
            $billingUserId = (int) $billing->user_id;
            $currentUserId = (int) Auth::id();
            
            if ($billingUserId !== $currentUserId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to billing record',
                    'debug' => [
                        'original_current_user_id' => $originalCurrentUserId,
                        'original_current_user_id_type' => gettype($originalCurrentUserId),
                        'original_billing_user_id' => $originalBillingUserId,
                        'original_billing_user_id_type' => gettype($originalBillingUserId),
                        'converted_current_user_id' => $currentUserId,
                        'converted_billing_user_id' => $billingUserId,
                        'authenticated' => Auth::check(),
                        'strict_comparison_original' => $billing->user_id === Auth::id(),
                        'loose_comparison_original' => $billing->user_id == Auth::id(),
                        'integer_comparison' => $billingUserId === $currentUserId
                    ]
                ], 403);
            }

            // Handle file upload
            $paymentProofPath = null;
            if ($request->hasFile('payment_file')) {
                $file = $request->file('payment_file');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $paymentProofPath = $file->storeAs('payment_proofs', $fileName, 'public');
            }

            // Get payment account details for notification
            $paymentAccount = tbl_bank_account_category::with('bankAccountType')->find($request->account_id);

            // Update billing record with receipt and status
            $billing->update([
                'receipt' => $paymentProofPath,
                'status' => 'under review',
                'payment_account_id' => $request->account_id,
            ]);

            // Log payment activity
            try {
                Auth::user()->logCustom(
                    "Payment submitted for Bill #" . str_pad($billing->id, 6, '0', STR_PAD_LEFT) . 
                    " - Amount: ₱" . number_format($billing->amount_due, 2) . 
                    " - Payment method: " . ($paymentAccount->account_name ?? 'N/A') . 
                    " - Status: Under Review"
                );
                \Log::info('Payment activity logged successfully', [
                    'user_id' => Auth::id(),
                    'billing_id' => $billing->id
                ]);
            } catch (\Exception $e) {
                \Log::error('Error logging payment activity', [
                    'error' => $e->getMessage(),
                    'user_id' => Auth::id(),
                    'billing_id' => $billing->id
                ]);
            }

            // Send notification to the user who made the payment
            try {
                \Log::info('Sending payment confirmation notification to user', [
                    'user_id' => Auth::id(),
                    'user_name' => Auth::user()->name,
                    'billing_id' => $billing->id,
                    'amount' => $billing->amount_due
                ]);

                // Get billing management module ID for notification_settings_id
                $billingModule = module::where('module_name', 'billing management')->first();
                $moduleId = $billingModule ? $billingModule->id : null;
                
                // NOTIFICATION 1: For the user who made the payment (success notification)
                $userNotification = Auth::user()->notifySuccess(
                    'Payment Submitted Successfully',
                    'Your payment of ₱' . number_format($billing->amount_due, 2) . ' for Bill #' . str_pad($billing->id, 6, '0', STR_PAD_LEFT) . ' has been submitted and is now under review. You will be notified once it is processed.',
                    $moduleId
                );

                \Log::info('User notification sent successfully', [
                    'notification_id' => $userNotification->id,
                    'user_id' => Auth::id(),
                    'billing_id' => $billing->id
                ]);
            } catch (\Exception $e) {
                \Log::error('Error sending payment confirmation notification to user', [
                    'error' => $e->getMessage(),
                    'user_id' => Auth::id(),
                    'billing_id' => $billing->id,
                    'trace' => $e->getTraceAsString()
                ]);
            }

            // Send notifications to billing management users
            try {
                $this->sendBillingManagementNotifications($billing, $paymentAccount, 'Payment has been submitted and is under review.');
                \Log::info('Billing management notifications sent successfully');
            } catch (\Exception $e) {
                \Log::error('Failed to send billing management notifications: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment submitted successfully! Your payment is now under review.',
                'data' => [
                    'billing_id' => $request->billing_id,
                    'account_id' => $request->account_id,
                    'payment_proof' => $paymentProofPath,
                    'status' => 'under review'
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error processing payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update payment status and send notifications
     * This method can be called by admin to approve/reject payments
     */
    public function updatePaymentStatus(Request $request, $billingId)
    {
        try {
            $request->validate([
                'status' => 'required|in:approved,rejected',
                'reason' => 'nullable|string|max:500'
            ]);

            $billing = tbl_billing_management::with('user')->findOrFail($billingId);
            
            // Update billing status
            $billing->update([
                'status' => $request->status,
                'reason' => $request->reason
            ]);

            // Send notification to the user who made the payment
            $user = $billing->user;
            if ($user) {
                // Get billing management module ID for notification_settings_id
                $billingModule = module::where('module_name', 'billing management')->first();
                $moduleId = $billingModule ? $billingModule->id : null;
                
                // NOTIFICATION 1: For the user who made the payment (about their own payment status)
                if ($request->status === 'approved') {
                    $user->notifySuccess(
                        'Payment Approved',
                        'Your payment of ₱' . number_format($billing->amount_due, 2) . ' for Bill #' . str_pad($billing->id, 6, '0', STR_PAD_LEFT) . ' has been approved and processed successfully.',
                        $moduleId
                    );
                } else {
                    $user->notifyError(
                        'Payment Rejected',
                        'Your payment of ₱' . number_format($billing->amount_due, 2) . ' for Bill #' . str_pad($billing->id, 6, '0', STR_PAD_LEFT) . ' has been rejected.' . ($request->reason ? ' Reason: ' . $request->reason : ''),
                        $moduleId
                    );
                }
            }

            // Send notifications to billing management users
            $paymentAccount = tbl_bank_account_category::with('bankAccountType')->find($billing->payment_account_id);
            $statusMessage = $request->status === 'approved' 
                ? 'Payment has been approved and processed.'
                : 'Payment has been rejected.' . ($request->reason ? ' Reason: ' . $request->reason : '');

            $this->sendBillingManagementNotifications($billing, $paymentAccount, $statusMessage);

            return response()->json([
                'success' => true,
                'message' => 'Payment status updated successfully',
                'data' => [
                    'billing_id' => $billing->id,
                    'status' => $request->status,
                    'reason' => $request->reason
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating payment status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test method to check notification system
     */
    public function testNotifications()
    {
        try {
            // Test 1: Check all available modules
            $allModules = module::all();
            
            // Test 2: Check if billing management module exists (try different variations)
            $possibleModuleNames = [
                'billing management',
                'Billing Management', 
                'Billing management',
                'billing_management',
                'Billing_Management'
            ];
            
            $billingModule = null;
            foreach ($possibleModuleNames as $moduleName) {
                $billingModule = module::where('module_name', $moduleName)->first();
                if ($billingModule) break;
            }
            
            // Test 3: Check notification settings
            $notificationSettings = notification_settings::with(['user', 'module'])->get();
            
            // Test 4: Try to send a test notification to current user
            $testNotification = Auth::user()->notifyInfo(
                'Test Notification',
                'This is a test notification to verify the notification system is working.'
            );

            // Test 5: Check if we can create activity log
            $testActivityLog = Auth::user()->logCustom('Test activity log entry');

            return response()->json([
                'success' => true,
                'message' => 'Notification system test completed',
                'data' => [
                    'all_modules' => $allModules->map(function($module) {
                        return [
                            'id' => $module->id,
                            'name' => $module->module_name,
                            'status' => $module->status
                        ];
                    }),
                    'billing_module' => $billingModule ? [
                        'id' => $billingModule->id,
                        'name' => $billingModule->module_name,
                        'status' => $billingModule->status
                    ] : null,
                    'notification_settings_count' => $notificationSettings->count(),
                    'notification_settings' => $notificationSettings->map(function($setting) {
                        return [
                            'id' => $setting->id,
                            'user_id' => $setting->users_id,
                            'user_name' => $setting->user->name ?? 'N/A',
                            'module_id' => $setting->module_id,
                            'module_name' => $setting->module->module_name ?? 'N/A',
                            'status' => $setting->status
                        ];
                    }),
                    'test_notification_id' => $testNotification->id,
                    'test_activity_log_id' => $testActivityLog->id,
                    'current_user_id' => Auth::id(),
                    'current_user_name' => Auth::user()->name,
                    'user_has_notification_trait' => method_exists(Auth::user(), 'notifyInfo'),
                    'user_has_activity_log_trait' => method_exists(Auth::user(), 'logCustom')
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Test failed: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}

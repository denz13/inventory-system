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
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class BillingPaymentController extends Controller
{
    public function index(Request $request)
    {
        // Build query for user's billings
        $query = tbl_billing_management::with(['billingItems'])
            ->where('user_id', Auth::id());
        
        // Apply search filter
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('billing_date', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%")
                  ->orWhere('amount_due', 'like', "%{$search}%");
            });
        }
        
        // Apply date range filter
        if ($request->has('date_from') && $request->has('date_to')) {
            $dateFrom = $request->date_from;
            $dateTo = $request->date_to;
            
            // For billing_date that might be a range, we'll try to extract the first date
            $query->where(function($q) use ($dateFrom, $dateTo) {
                $q->whereBetween('created_at', [$dateFrom, $dateTo]);
            });
        }
        
        $perPage = $request->input('per_page', 10);
        $userBillings = $query->orderBy('created_at', 'desc')->paginate($perPage);

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

            // Generate official receipt if payment is approved
            if ($request->status === 'approved') {
                try {
                    $this->generateOfficialReceipt($billing);
                    \Log::info('Official receipt generated for approved payment', [
                        'billing_id' => $billing->id
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Failed to generate official receipt', [
                        'billing_id' => $billing->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

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
     * Generate official receipt HTML content
     */
    private function generateReceiptHTML($data)
    {
        $html = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Official Receipt - ' . $data['receipt_number'] . '</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .receipt-container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .receipt-header {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .receipt-title {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 5px 0;
        }
        .receipt-subtitle {
            font-size: 12px;
            opacity: 0.9;
        }
        .receipt-body {
            padding: 20px;
        }
        .amount-section {
            text-align: center;
            margin-bottom: 20px;
        }
        .amount-label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 5px;
        }
        .amount-value {
            font-size: 24px;
            font-weight: bold;
            color: #10b981;
        }
        .status-badge {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
        }
        .details-section {
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .detail-label {
            color: #6b7280;
        }
        .detail-value {
            font-weight: 500;
            color: #374151;
        }
        .items-section {
            margin-top: 20px;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }
        .items-title {
            font-size: 14px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 10px;
        }
        .item-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 13px;
        }
        .item-name {
            color: #6b7280;
        }
        .item-price {
            font-weight: 500;
            color: #374151;
        }
        .total-row {
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
            margin-top: 10px;
            font-weight: bold;
            font-size: 14px;
        }
        .receipt-footer {
            background: #f9fafb;
            padding: 15px 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-text {
            font-size: 11px;
            color: #6b7280;
            margin: 0;
        }
        .reference-number {
            font-family: monospace;
            font-size: 12px;
            color: #374151;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="receipt-header">
            <div class="receipt-title">OFFICIAL RECEIPT</div>
            <div class="receipt-subtitle">Payment Confirmation</div>
        </div>
        
        <div class="receipt-body">
            <div class="amount-section">
                <div class="amount-label">Amount Paid</div>
                <div class="amount-value">₱' . number_format($data['amount_paid'], 2) . '</div>
                <div class="status-badge">' . strtoupper($data['status']) . '</div>
            </div>
            
            <div class="details-section">
                <div class="detail-row">
                    <span class="detail-label">Receipt No.</span>
                    <span class="detail-value">' . $data['receipt_number'] . '</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Date</span>
                    <span class="detail-value">' . $data['payment_date'] . '</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Bill Number</span>
                    <span class="detail-value">' . $data['bill_number'] . '</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Customer</span>
                    <span class="detail-value">' . $data['customer_name'] . '</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">' . $data['customer_email'] . '</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Method</span>
                    <span class="detail-value">' . $data['payment_method'] . '</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Processed By</span>
                    <span class="detail-value">' . $data['processed_by'] . '</span>
                </div>
            </div>
            
            <div class="items-section">
                <div class="items-title">Billing Items</div>';
        
        foreach ($data['billing_items'] as $item) {
            $html .= '
                <div class="item-row">
                    <span class="item-name">' . $item['description'] . ' (Qty: ' . $item['qty'] . ')</span>
                    <span class="item-price">₱' . number_format($item['total'], 2) . '</span>
                </div>';
        }
        
        $html .= '
                <div class="item-row total-row">
                    <span class="item-name">TOTAL AMOUNT</span>
                    <span class="item-price">₱' . number_format($data['amount_paid'], 2) . '</span>
                </div>
            </div>
        </div>
        
        <div class="receipt-footer">
            <p class="footer-text">Thank you for your payment!</p>
            <p class="footer-text">This is an official receipt generated by the system.</p>
            <div class="reference-number">Ref: ' . $data['reference_number'] . '</div>
        </div>
    </div>
</body>
</html>';
        
        return $html;
    }

    /**
     * Generate official receipt and save to storage
     */
    private function generateOfficialReceipt($billing)
    {
        try {
            // Get billing items
            $billingItems = $billing->billingItems->map(function($item) {
                return [
                    'description' => $item->description,
                    'qty' => $item->qty,
                    'price' => $item->price,
                    'total' => $item->qty * $item->price
                ];
            });

            // Prepare receipt data
            $receiptData = [
                'receipt_number' => 'OR-' . str_pad($billing->id, 6, '0', STR_PAD_LEFT),
                'payment_date' => Carbon::now()->format('M d, Y - h:i A'),
                'bill_number' => 'Bill #' . str_pad($billing->id, 6, '0', STR_PAD_LEFT),
                'customer_name' => $billing->user->name ?? 'N/A',
                'customer_email' => $billing->user->email ?? 'N/A',
                'amount_paid' => $billing->amount_due,
                'payment_method' => 'Online Payment',
                'status' => 'Approved',
                'processed_by' => 'System Administrator',
                'billing_items' => $billingItems,
                'reference_number' => 'REF-' . time() . '-' . $billing->id
            ];

            // Generate HTML content
            $htmlContent = $this->generateReceiptHTML($receiptData);

            // Create directory if it doesn't exist
            $directory = 'receipts/official';
            if (!Storage::disk('public')->exists($directory)) {
                Storage::disk('public')->makeDirectory($directory);
            }

            // Save HTML file
            $fileName = 'official_receipt_' . $billing->id . '_' . time() . '.html';
            $filePath = $directory . '/' . $fileName;
            
            Storage::disk('public')->put($filePath, $htmlContent);

            // Update billing record with official receipt path
            $billing->update([
                'official_receipt' => $filePath
            ]);

            \Log::info('Official receipt generated successfully', [
                'billing_id' => $billing->id,
                'receipt_path' => $filePath,
                'receipt_number' => $receiptData['receipt_number']
            ]);

            return $filePath;

        } catch (\Exception $e) {
            \Log::error('Error generating official receipt', [
                'billing_id' => $billing->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
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

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
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ListPaymentsController extends Controller
{
    public function index(Request $request)
    {
        // Get per page from request, default to 10
        $perPage = $request->input('per_page', 10);
        
        // Start query
        $query = tbl_billing_management::with(['user']);
        
        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('id', 'like', '%' . $searchTerm . '%')
                  ->orWhereHas('user', function($userQuery) use ($searchTerm) {
                      $userQuery->where('name', 'like', '%' . $searchTerm . '%')
                                ->orWhere('email', 'like', '%' . $searchTerm . '%');
                  })
                  ->orWhere('status', 'like', '%' . $searchTerm . '%')
                  ->orWhere('amount_due', 'like', '%' . $searchTerm . '%');
            });
        }
        
        // Status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Apply date range filter (server-side)
        if ($request->has('date_range') && $request->date_range != '') {
            $dateRange = $request->date_range;
            
            // Parse the date range (format: "1 Aug, 2025 - 31 Aug, 2025")
            $dateParts = explode(' - ', $dateRange);
            if (count($dateParts) === 2) {
                try {
                    $startDate = Carbon::parse(trim($dateParts[0]))->startOfDay();
                    $endDate = Carbon::parse(trim($dateParts[1]))->endOfDay();
                    
                    // Filter by billing_date range
                    $query->where(function($q) use ($startDate, $endDate, $dateRange) {
                        // Direct match or date range overlap
                        $q->where('billing_date', 'like', "%{$dateRange}%")
                          ->orWhere(function($subQ) use ($startDate, $endDate) {
                              // Also check if created_at falls within the range
                              $subQ->whereBetween('created_at', [$startDate, $endDate]);
                          });
                    });
                    
                    \Log::info('Date range filter applied', [
                        'date_range' => $dateRange,
                        'start_date' => $startDate->format('Y-m-d'),
                        'end_date' => $endDate->format('Y-m-d')
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Error parsing date range: ' . $e->getMessage());
                }
            }
        }
        
        // Name sorting
        if ($request->has('name_sort') && in_array($request->name_sort, ['a-z', 'z-a'])) {
            $sortDirection = $request->name_sort === 'a-z' ? 'asc' : 'desc';
            $query->join('users', 'tbl_billing_management.user_id', '=', 'users.id')
                  ->orderBy('users.name', $sortDirection)
                  ->select('tbl_billing_management.*');
        } else {
            // Default sorting
            $query->orderBy('tbl_billing_management.created_at', 'desc');
        }
        
        // Paginate results
        $payments = $query->paginate($perPage)->appends($request->except('page'));

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
     * Generate official receipt for approved payment
     */
    private function generateOfficialReceipt($billing)
    {
        try {
            // Create receipt data
            $receiptData = [
                'receipt_number' => 'RCP-' . str_pad($billing->id, 8, '0', STR_PAD_LEFT),
                'payment_date' => Carbon::now()->format('d F Y g:i:s A'),
                'bill_number' => str_pad($billing->id, 6, '0', STR_PAD_LEFT),
                'customer_name' => $billing->user->name ?? 'N/A',
                'customer_email' => $billing->user->email ?? 'N/A',
                'amount_paid' => number_format($billing->amount_due, 2),
                'payment_method' => 'Digital Payment',
                'status' => 'PAID',
                'processed_by' => Auth::user()->name ?? 'System Administrator',
                'billing_items' => $billing->billingItems ?? collect(),
                'reference_number' => 'REF-' . strtoupper(substr(md5($billing->id . time()), 0, 12))
            ];

            // Generate HTML receipt
            $htmlReceipt = $this->generateReceiptHTML($receiptData);
            
            // Save receipt as HTML file
            $fileName = 'official_receipt_' . $billing->id . '_' . time() . '.html';
            $filePath = 'receipts/official/' . $fileName;
            
            Storage::disk('public')->put($filePath, $htmlReceipt);
            
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
            \Log::error('Error generating official receipt: ' . $e->getMessage(), [
                'billing_id' => $billing->id ?? 'N/A',
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    /**
     * Generate HTML receipt template
     */
    private function generateReceiptHTML($data)
    {
        $billingItemsHtml = '';
        if ($data['billing_items'] && $data['billing_items']->count() > 0) {
            foreach ($data['billing_items'] as $item) {
                $total = floatval($item->qty ?? 0) * floatval($item->price ?? 0);
                $billingItemsHtml .= '
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">' . ($item->description ?? 'N/A') . '</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">' . ($item->qty ?? 0) . '</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">₱' . number_format(floatval($item->price ?? 0), 2) . '</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">₱' . number_format($total, 2) . '</td>
                    </tr>';
            }
        } else {
            $billingItemsHtml = '<tr><td colspan="4" style="padding: 20px; text-align: center; color: #6b7280;">No billing items</td></tr>';
        }

        return '
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Official Receipt - ' . $data['receipt_number'] . '</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
                .receipt-container { max-width: 400px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
                .header p { margin: 5px 0 0 0; opacity: 0.9; }
                .content { padding: 20px; }
                .amount-section { text-align: center; margin: 20px 0; }
                .amount { font-size: 32px; font-weight: bold; color: #1f2937; margin: 10px 0; }
                .status { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; }
                .details { margin: 20px 0; }
                .detail-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
                .detail-label { font-weight: 600; color: #374151; }
                .detail-value { color: #6b7280; }
                .items-table { width: 100%; margin: 20px 0; border-collapse: collapse; }
                .items-table th { background: #f9fafb; padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; }
                .items-table td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
                .total-section { background: #f0f9ff; padding: 16px; border-radius: 8px; margin: 20px 0; }
                .total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #1f2937; }
                .footer { background: #f9fafb; padding: 16px; text-align: center; color: #6b7280; font-size: 12px; }
                .reference { background: #fef3c7; padding: 12px; border-radius: 8px; margin: 16px 0; text-align: center; }
                .reference-number { font-family: monospace; font-weight: bold; color: #92400e; }
            </style>
        </head>
        <body>
            <div class="receipt-container">
                <div class="header">
                    <h1>PAYMENT RECEIPT</h1>
                    <p>Official Payment Confirmation</p>
                </div>
                
                <div class="content">
                    <div class="amount-section">
                        
                        <div class="amount">₱' . $data['amount_paid'] . '</div>
                        <div class="status">' . $data['status'] . '</div>
                    </div>

                    <div class="reference">
                        <div style="font-size: 12px; color: #92400e; margin-bottom: 4px;">Reference Number</div>
                        <div class="reference-number">' . $data['reference_number'] . '</div>
                        <div style="font-size: 12px; color: #92400e; margin-top: 4px;">' . $data['payment_date'] . '</div>
                    </div>

                    <div class="details">
                        <div class="detail-row">
                            <span class="detail-label">Receipt No.</span>
                            <span class="detail-value">' . $data['receipt_number'] . '</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Bill Number</span>
                            <span class="detail-value">#' . $data['bill_number'] . '</span>
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

                    <div style="margin: 20px 0;">
                        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #374151;">Billing Items</h3>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th style="text-align: center;">Qty</th>
                                    <th style="text-align: right;">Price</th>
                                    <th style="text-align: right;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ' . $billingItemsHtml . '
                            </tbody>
                        </table>
                    </div>

                    <div class="total-section">
                        <div class="total-row">
                            <span>Total Amount Paid:</span>
                            <span>₱' . $data['amount_paid'] . '</span>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p>This is an official receipt for your payment.</p>
                    <p>Keep this receipt for your records.</p>
                    <p>Generated on ' . Carbon::now()->format('d F Y \a\t g:i A') . '</p>
                </div>
            </div>
        </body>
        </html>';
    }
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

            // Generate official receipt for approved payment
            try {
                $receiptPath = $this->generateOfficialReceipt($billing);
                \Log::info('Official receipt generation completed', [
                    'billing_id' => $billing->id,
                    'receipt_path' => $receiptPath
                ]);
            } catch (\Exception $e) {
                \Log::error('Error generating official receipt: ' . $e->getMessage(), [
                    'billing_id' => $billing->id
                ]);
                // Don't fail the approval if receipt generation fails
            }

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

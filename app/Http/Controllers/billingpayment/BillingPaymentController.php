<?php

namespace App\Http\Controllers\billingpayment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_billing_management;
use App\Models\tbl_bank_account_type;
use App\Models\tbl_bank_account_category;
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

            // Update billing record with receipt and status
            $billing->update([
                'receipt' => $paymentProofPath,
                'status' => 'under review',
                'payment_account_id' => $request->account_id,
            ]);

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
}

<?php

namespace App\Http\Controllers\listpayments;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_billing_management;
use App\Models\tbl_billing_management_list;
use Illuminate\Support\Facades\DB;

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
            
            $billing = tbl_billing_management::findOrFail($id);
            
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
            
            $billing = tbl_billing_management::findOrFail($id);
            
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

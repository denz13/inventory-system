<?php

namespace App\Http\Controllers\billingmanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_billing_management;
use App\Models\tbl_billing_management_list;
use App\Models\User;

class BillingManagementController extends Controller
{
    public function index()
    {
        $billings = tbl_billing_management::with(['user', 'billingItems'])->paginate(10);
        $users = User::all();
        
        return view('billing-management.billing-management', compact('billings', 'users'));
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
        $billing = tbl_billing_management::findOrFail($id);
        $billing->delete();

        return response()->json([
            'message' => 'Billing deleted successfully'
        ]);
    }
}

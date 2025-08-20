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
}

<?php

namespace App\Http\Controllers\bankaccount;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_bank_account_category;
use App\Models\tbl_bank_account_type;
use Illuminate\Support\Facades\Storage;

class BankAccountController extends Controller
{
    public function index()
    {
        $bankAccounts = tbl_bank_account_category::with('bankAccountType')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        $bankAccountTypes = tbl_bank_account_type::where('status', 'Active')->get();

        return view('bank-account.bank-account', compact('bankAccounts', 'bankAccountTypes'));
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'bank_account_type_id' => 'required|exists:tbl_bank_account_type,id',
                'account_name' => 'required|string|max:255',
                'account_number' => 'required|string|max:255|unique:tbl_bank_account_category,account_number',
                'qrcode_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $data = $request->only(['bank_account_type_id', 'account_name', 'account_number']);
            $data['status'] = 'Active'; // Automatically set to Active

            // Handle QR code image upload
            if ($request->hasFile('qrcode_image')) {
                $file = $request->file('qrcode_image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('uploads/qrcodes', $filename, 'public');
                $data['qrcode_image'] = $path;
            }

            $bankAccount = tbl_bank_account_category::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Bank account created successfully',
                'bankAccount' => $bankAccount->load('bankAccountType')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating bank account: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $bankAccount = tbl_bank_account_category::with('bankAccountType')->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'bankAccount' => $bankAccount
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bank account not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $bankAccount = tbl_bank_account_category::findOrFail($id);

            $request->validate([
                'bank_account_type_id' => 'required|exists:tbl_bank_account_type,id',
                'account_name' => 'required|string|max:255',
                'account_number' => 'required|string|max:255|unique:tbl_bank_account_category,account_number,' . $id,
                'qrcode_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $data = $request->only(['bank_account_type_id', 'account_name', 'account_number']);
            $data['status'] = 'Active'; // Automatically set to Active

            // Handle QR code image upload
            if ($request->hasFile('qrcode_image')) {
                // Delete old image if exists
                if ($bankAccount->qrcode_image && Storage::disk('public')->exists($bankAccount->qrcode_image)) {
                    Storage::disk('public')->delete($bankAccount->qrcode_image);
                }

                $file = $request->file('qrcode_image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('uploads/qrcodes', $filename, 'public');
                $data['qrcode_image'] = $path;
            }

            $bankAccount->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Bank account updated successfully',
                'bankAccount' => $bankAccount->load('bankAccountType')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating bank account: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $bankAccount = tbl_bank_account_category::findOrFail($id);

            // Delete QR code image if exists
            if ($bankAccount->qrcode_image && Storage::disk('public')->exists($bankAccount->qrcode_image)) {
                Storage::disk('public')->delete($bankAccount->qrcode_image);
            }

            $bankAccount->delete();

            return response()->json([
                'success' => true,
                'message' => 'Bank account deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting bank account: ' . $e->getMessage()
            ], 500);
        }
    }
}

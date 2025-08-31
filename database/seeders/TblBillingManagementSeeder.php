<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\tbl_billing_management;

class TblBillingManagementSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            tbl_billing_management::create([
                'user_id' => (string)$i,
                'billing_date' => now()->subDays($i)->format('Y-m-d'),
                'receipt' => 'RCPT' . str_pad((string)$i, 6, '0', STR_PAD_LEFT),
                'amount_due' => (string)rand(100, 1000),
                'status' => 'pending',
                'payment_account_id' => '1',
                'reason' => null,
            ]);
        }
    }
}



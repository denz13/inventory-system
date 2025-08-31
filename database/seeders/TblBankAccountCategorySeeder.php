<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\tbl_bank_account_category;

class TblBankAccountCategorySeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            ['account_name' => 'Main GCash', 'account_number' => '09' . rand(100000000, 999999999), 'type' => '1'],
            ['account_name' => 'Main PayMaya', 'account_number' => '09' . rand(100000000, 999999999), 'type' => '2'],
            ['account_name' => 'LandBank', 'account_number' => (string)rand(10000000, 99999999), 'type' => '3'],
        ];

        foreach ($accounts as $acc) {
            tbl_bank_account_category::create([
                'bank_account_type_id' => $acc['type'],
                'account_name' => $acc['account_name'],
                'account_number' => $acc['account_number'],
                'qrcode_image' => null,
                'status' => 'active',
            ]);
        }
    }
}



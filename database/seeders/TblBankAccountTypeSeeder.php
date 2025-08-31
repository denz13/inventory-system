<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\tbl_bank_account_type;

class TblBankAccountTypeSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['GCash', 'PayMaya', 'Bank'] as $type) {
            tbl_bank_account_type::create([
                'type' => $type,
                'status' => 'active',
            ]);
        }
    }
}



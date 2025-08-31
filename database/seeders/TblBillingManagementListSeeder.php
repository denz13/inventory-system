<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\tbl_billing_management_list;

class TblBillingManagementListSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 20; $i++) {
            tbl_billing_management_list::create([
                'billing_management_id' => (string)ceil($i / 2),
                'description' => 'Item ' . $i,
                'qty' => (string)rand(1, 5),
                'price' => (string)rand(50, 500),
                'is_pay' => (string)($i % 2),
            ]);
        }
    }
}



<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\tbl_service_management_complaints;

class TblServiceManagementComplaintsSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            tbl_service_management_complaints::create([
                'service_management_category_id' => (string)rand(1, 3),
                'user_id' => (string)$i,
                'complaint_description' => 'Complaint desc ' . $i,
                'status' => 'open',
                'reason' => null,
            ]);
        }
    }
}



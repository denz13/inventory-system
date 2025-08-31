<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\tbl_service_management_category;

class TblServiceManagementCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['service_management_type_id' => '1', 'category' => 'Electrical'],
            ['service_management_type_id' => '1', 'category' => 'Plumbing'],
            ['service_management_type_id' => '2', 'category' => 'Patrol'],
        ];

        foreach ($categories as $cat) {
            tbl_service_management_category::create([
                'service_management_type_id' => $cat['service_management_type_id'],
                'category' => $cat['category'],
                'status' => 'active',
            ]);
        }
    }
}



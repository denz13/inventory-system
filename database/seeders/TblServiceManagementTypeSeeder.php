<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\tbl_service_management_type;

class TblServiceManagementTypeSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Maintenance','Security','Utilities'] as $type) {
            tbl_service_management_type::create([
                'type' => $type,
                'status' => 'active',
            ]);
        }
    }
}



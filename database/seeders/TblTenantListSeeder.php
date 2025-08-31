<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\tbl_tenant_list;

class TblTenantListSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 12; $i++) {
            tbl_tenant_list::create([
                'user_id' => (string)$i,
                'full_name' => 'Tenant ' . $i,
                'relationship' => 'Family',
                'contact_number' => '+1' . rand(1000000000, 9999999999),
                'email' => 'tenant' . $i . '@example.com',
                'photo' => null,
                'status' => 'active',
            ]);
        }
    }
}



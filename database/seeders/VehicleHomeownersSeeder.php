<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\vehicle_homeowners;

class VehicleHomeownersSeeder extends Seeder
{
    public function run(): void
    {
        $types = ['Car','Motorcycle','Truck'];
        for ($i = 1; $i <= 8; $i++) {
            vehicle_homeowners::create([
                'user_id' => (string)$i,
                'type_of_vehicle' => $types[array_rand($types)],
                'status' => 'active',
            ]);
        }
    }
}



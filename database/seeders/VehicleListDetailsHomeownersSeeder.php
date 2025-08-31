<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\vehicle_list_details_homeowners;

class VehicleListDetailsHomeownersSeeder extends Seeder
{
    public function run(): void
    {
        $colors = ['Red','Blue','Black','White'];
        for ($i = 1; $i <= 8; $i++) {
            vehicle_list_details_homeowners::create([
                'vehicle_homeowners_supporting_documents_id' => (string)$i,
                'plate_number' => 'ABC' . rand(100, 999),
                'or_no' => 'OR' . rand(10000, 99999),
                'vehicle_model' => 'Model ' . $i,
                'cr_no' => 'CR' . rand(10000, 99999),
                'color_of_vehicle' => $colors[array_rand($colors)],
                'vehicle_sticker_control_no' => 'STK' . rand(10000, 99999),
                'status' => 'active',
            ]);
        }
    }
}



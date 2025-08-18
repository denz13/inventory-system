<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\vehicle_details;
use App\Models\vehicle_management_list;

class VehicleDetailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get vehicle management IDs to reference
        $vehicleManagementIds = vehicle_management_list::pluck('id')->toArray();
        
        if (empty($vehicleManagementIds)) {
            // Create default vehicle management if none exists
            $vehicleManagement = vehicle_management_list::create([
                'user_id' => 1,
                'non_homeowners' => 'No',
                'type_of_vehicle' => 'Car',
                'incase_of_emergency_name' => 'Default Contact',
                'incase_of_emergency_number' => '+1234567890',
                'status' => 'Active'
            ]);
            $vehicleManagementIds = [$vehicleManagement->id];
        }

        $vehicleModels = ['Toyota Camry', 'Honda Civic', 'Ford F-150', 'Chevrolet Silverado', 'Nissan Altima'];
        $colors = ['Red', 'Blue', 'Black', 'White', 'Silver', 'Gray'];
        $statuses = ['Active', 'Inactive', 'Maintenance', 'Sold'];

        for ($i = 1; $i <= 25; $i++) {
            vehicle_details::create([
                'vehicle_management_id' => $vehicleManagementIds[array_rand($vehicleManagementIds)],
                'plate_number' => 'ABC' . rand(100, 999),
                'or_number' => 'OR' . rand(100000, 999999),
                'cr_number' => 'CR' . rand(100000, 999999),
                'vehicle_model' => $vehicleModels[array_rand($vehicleModels)],
                'color' => $colors[array_rand($colors)],
                'sticker_control_number' => 'STK' . rand(10000, 99999),
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }
}

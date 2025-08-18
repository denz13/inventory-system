<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\vehicle_management_list;
use App\Models\User;

class VehicleManagementListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some user IDs to reference
        $userIds = User::pluck('id')->toArray();
        
        if (empty($userIds)) {
            // Create a default user if none exists
            $user = User::create([
                'name' => 'Default User',
                'email' => 'default@example.com',
                'password' => bcrypt('password'),
                'role' => 'user',
                'active' => 1
            ]);
            $userIds = [$user->id];
        }

        $vehicleTypes = ['Car', 'Motorcycle', 'Truck', 'Van', 'SUV'];
        $statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];

        for ($i = 1; $i <= 20; $i++) {
            vehicle_management_list::create([
                'user_id' => $userIds[array_rand($userIds)],
                'non_homeowners' => rand(0, 1) ? 'Yes' : 'No',
                'type_of_vehicle' => $vehicleTypes[array_rand($vehicleTypes)],
                'incase_of_emergency_name' => 'Emergency Contact ' . $i,
                'incase_of_emergency_number' => '+1' . rand(1000000000, 9999999999),
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }
}

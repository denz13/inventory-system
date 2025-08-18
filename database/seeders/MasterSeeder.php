<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\business_management_list;
use App\Models\tbl_entry_data;
use App\Models\tbl_entry_data_product;
use App\Models\vehicle_management_list;
use App\Models\vehicle_details;

class MasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Users first
        $this->createUsers();
        
        // 2. Create Business Management List
        $this->createBusinessManagement();
        
        // 3. Create Entry Data
        $this->createEntryData();
        
        // 4. Create Entry Data Products
        $this->createEntryDataProducts();
        
        // 5. Create Vehicle Management List
        $this->createVehicleManagement();
        
        // 6. Create Vehicle Details
        $this->createVehicleDetails();
    }

    private function createUsers()
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'active' => true,
                'gender' => 'Male',
                'street' => '123 Admin Street',
                'lot' => 'A1',
                'block' => 'B1',
                'contact_number' => '+1234567890',
                'membership_fee' => 100.00,
                'is_with_title' => true,
            ],
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => bcrypt('password'),
                'role' => 'user',
                'active' => true,
                'gender' => 'Male',
                'street' => '456 Main Street',
                'lot' => 'C2',
                'block' => 'D2',
                'contact_number' => '+1234567891',
                'membership_fee' => 75.00,
                'is_with_title' => false,
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => bcrypt('password'),
                'role' => 'user',
                'active' => true,
                'gender' => 'Female',
                'street' => '789 Oak Avenue',
                'lot' => 'E3',
                'block' => 'F3',
                'contact_number' => '+1234567892',
                'membership_fee' => 85.00,
                'is_with_title' => true,
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        // Create additional random users
        for ($i = 4; $i <= 10; $i++) {
            User::create([
                'name' => 'User ' . $i,
                'email' => 'user' . $i . '@example.com',
                'password' => bcrypt('password'),
                'role' => 'user',
                'active' => rand(0, 1),
                'gender' => rand(0, 1) ? 'Male' : 'Female',
                'street' => 'Street ' . $i,
                'lot' => 'Lot ' . $i,
                'block' => 'Block ' . $i,
                'contact_number' => '+1' . rand(1000000000, 9999999999),
                'membership_fee' => rand(50, 200),
                'is_with_title' => rand(0, 1),
            ]);
        }
    }

    private function createBusinessManagement()
    {
        $userIds = User::pluck('id')->toArray();
        $businessTypes = ['Retail', 'Food Service', 'Manufacturing', 'Consulting', 'Technology', 'Healthcare', 'Education'];
        $statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];

        for ($i = 1; $i <= 20; $i++) {
            business_management_list::create([
                'user_id' => $userIds[array_rand($userIds)],
                'type_of_business' => $businessTypes[array_rand($businessTypes)],
                'business_name' => 'Business ' . $i,
                'address' => 'Business Address ' . $i . ', City, State',
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }

    private function createEntryData()
    {
        $packages = ['Basic', 'Standard', 'Premium', 'Enterprise', 'Custom', 'Starter', 'Professional'];
        $statuses = ['Active', 'Completed', 'Pending', 'Cancelled', 'On Hold'];

        for ($i = 1; $i <= 25; $i++) {
            tbl_entry_data::create([
                'client_name' => 'Client ' . $i,
                'address' => 'Client Address ' . $i . ', City, State',
                'date' => now()->subDays(rand(1, 365))->format('Y-m-d'),
                'package' => $packages[array_rand($packages)],
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }

    private function createEntryDataProducts()
    {
        $entryDataIds = tbl_entry_data::pluck('id')->toArray();
        $descriptions = ['Product A', 'Product B', 'Product C', 'Service X', 'Service Y', 'Item 1', 'Item 2'];
        $statuses = ['Available', 'Out of Stock', 'Discontinued', 'Limited'];

        for ($i = 1; $i <= 30; $i++) {
            tbl_entry_data_product::create([
                'entry_data_id' => $entryDataIds[array_rand($entryDataIds)],
                'description' => $descriptions[array_rand($descriptions)],
                'quantity' => (string)rand(1, 100),
                'rec_meter' => (string)rand(1, 1000),
                'qty' => (string)rand(1, 50),
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }

    private function createVehicleManagement()
    {
        $userIds = User::pluck('id')->toArray();
        $vehicleTypes = ['Car', 'Motorcycle', 'Truck', 'Van', 'SUV', 'Sedan', 'Hatchback'];
        $statuses = ['Active', 'Inactive', 'Pending', 'Suspended', 'Expired'];

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

    private function createVehicleDetails()
    {
        $vehicleManagementIds = vehicle_management_list::pluck('id')->toArray();
        $vehicleModels = ['Toyota Camry', 'Honda Civic', 'Ford F-150', 'Chevrolet Silverado', 'Nissan Altima', 'BMW 3 Series', 'Mercedes C-Class'];
        $colors = ['Red', 'Blue', 'Black', 'White', 'Silver', 'Gray', 'Green', 'Yellow'];
        $statuses = ['Active', 'Inactive', 'Maintenance', 'Sold', 'Stolen'];

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

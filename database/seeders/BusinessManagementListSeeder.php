<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\business_management_list;
use App\Models\User;

class BusinessManagementListSeeder extends Seeder
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

        $businessTypes = ['Retail', 'Food Service', 'Manufacturing', 'Consulting', 'Technology'];
        $statuses = ['Active', 'Inactive', 'Pending'];

        for ($i = 1; $i <= 20; $i++) {
            business_management_list::create([
                'user_id' => $userIds[array_rand($userIds)],
                'type_of_business' => $businessTypes[array_rand($businessTypes)],
                'business_name' => 'Business ' . $i,
                'address' => 'Address ' . $i . ', City, State',
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }
}

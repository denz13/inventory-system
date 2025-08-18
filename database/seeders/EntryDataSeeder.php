<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\tbl_entry_data;

class EntryDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = ['Basic', 'Standard', 'Premium', 'Enterprise', 'Custom'];
        $statuses = ['Active', 'Completed', 'Pending', 'Cancelled'];

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
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\tbl_entry_data_product;
use App\Models\tbl_entry_data;

class EntryDataProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get entry data IDs to reference
        $entryDataIds = tbl_entry_data::pluck('id')->toArray();
        
        if (empty($entryDataIds)) {
            // Create default entry data if none exists
            $entryData = tbl_entry_data::create([
                'client_name' => 'Default Client',
                'address' => 'Default Address',
                'date' => now()->format('Y-m-d'),
                'package' => 'Basic',
                'status' => 'Active'
            ]);
            $entryDataIds = [$entryData->id];
        }

        $descriptions = ['Product A', 'Product B', 'Product C', 'Service X', 'Service Y'];
        $statuses = ['Available', 'Out of Stock', 'Discontinued'];

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
}

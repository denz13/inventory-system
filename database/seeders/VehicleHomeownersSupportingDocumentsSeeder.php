<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\vehicle_homeowners_supporting_documents;

class VehicleHomeownersSupportingDocumentsSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 8; $i++) {
            vehicle_homeowners_supporting_documents::create([
                'vehicle_homeowners_id' => (string)$i,
                'supporting_documents_attachments' => null,
                'status' => 'submitted',
            ]);
        }
    }
}



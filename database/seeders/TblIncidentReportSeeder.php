<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\tbl_incident_report;

class TblIncidentReportSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 8; $i++) {
            tbl_incident_report::create([
                'user_id' => (string)$i,
                'person_involved_name' => 'Person ' . $i,
                'address' => 'Address ' . $i,
                'designation' => 'Resident',
                'datetime_of_incident' => now()->subDays($i)->toDateTimeString(),
                'location_of_incident' => 'Gate ' . $i,
                'guard_id' => (string)max(1, $i - 1),
                'reason' => 'Test reason',
                'status' => 'open',
            ]);
        }
    }
}



<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\tbl_appointment;

class TblAppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = ['pending','approved','cancelled','completed'];
        for ($i = 1; $i <= 15; $i++) {
            tbl_appointment::create([
                'description' => 'Appointment ' . $i,
                'appointment_date' => now()->addDays($i)->format('Y-m-d'),
                'tracking_number' => 'TRK' . str_pad((string)$i, 6, '0', STR_PAD_LEFT),
                'remarks' => 'Remarks ' . $i,
                'status' => $statuses[array_rand($statuses)],
                'is_expired' => (string)($i % 2),
            ]);
        }
    }
}



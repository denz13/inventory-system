<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\tbl_announcement;

class TblAnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $types = ['Notice', 'Event', 'Alert', 'Update'];
        $visibilities = ['all', 'admins', 'residents', 'guards'];
        $statuses = ['active', 'inactive'];

        for ($i = 1; $i <= 10; $i++) {
            tbl_announcement::create([
                'type' => $types[array_rand($types)],
                'description' => 'Announcement #' . $i,
                'visible_to' => $visibilities[array_rand($visibilities)],
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }
}



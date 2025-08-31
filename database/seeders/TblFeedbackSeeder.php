<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\tbl_feedback;

class TblFeedbackSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            tbl_feedback::create([
                'user_id' => (string)$i,
                'description' => 'Feedback ' . $i,
                'rating' => (string)rand(1, 5),
                'status' => 'visible',
            ]);
        }
    }
}



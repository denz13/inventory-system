<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\tbl_otp;

class TblOtpSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            tbl_otp::create([
                'user_id' => (string)$i,
                'email' => 'user' . $i . '@example.com',
                'otp_code' => (string)rand(100000, 999999),
                'status' => 'not_used',
                'expire_at' => now()->addMinutes(10)->toDateTimeString(),
            ]);
        }
    }
}



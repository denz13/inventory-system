<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\tbl_otp;
use Carbon\Carbon;

class CleanupExpiredOtps extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'otp:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark expired OTPs as expired and clean up old records';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Mark expired OTPs as expired
        $expiredCount = tbl_otp::notUsed()
                              ->where('expire_at', '<', Carbon::now())
                              ->update(['status' => tbl_otp::STATUS_EXPIRED]);

        // Optionally, delete old expired OTPs (older than 24 hours)
        $deletedCount = tbl_otp::expired()
                              ->where('updated_at', '<', Carbon::now()->subHours(24))
                              ->delete();

        $this->info("Marked {$expiredCount} OTPs as expired");
        $this->info("Deleted {$deletedCount} old expired OTP records");
        
        return Command::SUCCESS;
    }
}

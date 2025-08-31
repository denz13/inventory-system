<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            TblAnnouncementSeeder::class,
            TblAppointmentSeeder::class,
            TblBankAccountTypeSeeder::class,
            TblBankAccountCategorySeeder::class,
            TblBillingManagementSeeder::class,
            TblBillingManagementListSeeder::class,
            TblFeedbackSeeder::class,
            TblIncidentReportSeeder::class,
            TblOtpSeeder::class,
            TblServiceManagementTypeSeeder::class,
            TblServiceManagementCategorySeeder::class,
            TblServiceManagementComplaintsSeeder::class,
            TblTenantListSeeder::class,
            VehicleHomeownersSeeder::class,
            VehicleHomeownersSupportingDocumentsSeeder::class,
            VehicleListDetailsHomeownersSeeder::class,
        ]);
    }
}

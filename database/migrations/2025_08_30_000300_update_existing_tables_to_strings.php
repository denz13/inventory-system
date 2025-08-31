<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // business_management_list: drop FK, convert id refs to string, add missing columns
        if (Schema::hasTable('business_management_list')) {
            Schema::table('business_management_list', function (Blueprint $table) {
                try { $table->dropForeign(['user_id']); } catch (\Throwable $e) {}
                if (!Schema::hasColumn('business_management_list', 'business_clearance')) {
                    $table->string('business_clearance')->nullable()->after('business_name');
                }
                if (!Schema::hasColumn('business_management_list', 'reason')) {
                    $table->string('reason')->nullable()->after('status');
                }
            });
            // Change column types using raw SQL to avoid doctrine/dbal requirement
            DB::statement("ALTER TABLE business_management_list MODIFY COLUMN user_id VARCHAR(255) NULL");
            DB::statement("ALTER TABLE business_management_list MODIFY COLUMN type_of_business VARCHAR(255) NULL");
            DB::statement("ALTER TABLE business_management_list MODIFY COLUMN business_name VARCHAR(255) NULL");
            DB::statement("ALTER TABLE business_management_list MODIFY COLUMN address VARCHAR(255) NULL");
            DB::statement("ALTER TABLE business_management_list MODIFY COLUMN status VARCHAR(255) NULL");
        }

        // vehicle_management_list: drop FK, convert id ref to string
        if (Schema::hasTable('vehicle_management_list')) {
            Schema::table('vehicle_management_list', function (Blueprint $table) {
                try { $table->dropForeign(['user_id']); } catch (\Throwable $e) {}
            });
            DB::statement("ALTER TABLE vehicle_management_list MODIFY COLUMN user_id VARCHAR(255) NULL");
            DB::statement("ALTER TABLE vehicle_management_list MODIFY COLUMN non_homeowners VARCHAR(255) NULL");
            DB::statement("ALTER TABLE vehicle_management_list MODIFY COLUMN type_of_vehicle VARCHAR(255) NULL");
            DB::statement("ALTER TABLE vehicle_management_list MODIFY COLUMN incase_of_emergency_name VARCHAR(255) NULL");
            DB::statement("ALTER TABLE vehicle_management_list MODIFY COLUMN incase_of_emergency_number VARCHAR(255) NULL");
            DB::statement("ALTER TABLE vehicle_management_list MODIFY COLUMN status VARCHAR(255) NULL");
        }

        // vehicle_details: drop FK, convert id ref to string
        if (Schema::hasTable('vehicle_details')) {
            Schema::table('vehicle_details', function (Blueprint $table) {
                try { $table->dropForeign(['vehicle_management_id']); } catch (\Throwable $e) {}
            });
            DB::statement("ALTER TABLE vehicle_details MODIFY COLUMN vehicle_management_id VARCHAR(255) NULL");
            DB::statement("ALTER TABLE vehicle_details MODIFY COLUMN plate_number VARCHAR(255) NULL");
            DB::statement("ALTER TABLE vehicle_details MODIFY COLUMN or_number VARCHAR(255) NULL");
            DB::statement("ALTER TABLE vehicle_details MODIFY COLUMN cr_number VARCHAR(255) NULL");
            DB::statement("ALTER TABLE vehicle_details MODIFY COLUMN vehicle_model VARCHAR(255) NULL");
            DB::statement("ALTER TABLE vehicle_details MODIFY COLUMN color VARCHAR(255) NULL");
            DB::statement("ALTER TABLE vehicle_details MODIFY COLUMN sticker_control_number VARCHAR(255) NULL");
            DB::statement("ALTER TABLE vehicle_details MODIFY COLUMN status VARCHAR(255) NULL");
        }

        // tbl_appointment: convert all to string nullable
        if (Schema::hasTable('tbl_appointment')) {
            DB::statement("ALTER TABLE tbl_appointment MODIFY COLUMN description VARCHAR(255) NULL");
            DB::statement("ALTER TABLE tbl_appointment MODIFY COLUMN appointment_date VARCHAR(255) NULL");
            DB::statement("ALTER TABLE tbl_appointment MODIFY COLUMN tracking_number VARCHAR(255) NULL");
            DB::statement("ALTER TABLE tbl_appointment MODIFY COLUMN remarks VARCHAR(255) NULL");
            DB::statement("ALTER TABLE tbl_appointment MODIFY COLUMN status VARCHAR(255) NULL");
            DB::statement("ALTER TABLE tbl_appointment MODIFY COLUMN is_expired VARCHAR(255) NULL");
        }

        // tbl_incident_report: add missing columns as strings
        if (Schema::hasTable('tbl_incident_report')) {
            Schema::table('tbl_incident_report', function (Blueprint $table) {
                foreach ([
                    'user_id',
                    'person_involved_name',
                    'address',
                    'designation',
                    'datetime_of_incident',
                    'location_of_incident',
                    'guard_id',
                    'reason',
                    'status',
                ] as $col) {
                    if (!Schema::hasColumn('tbl_incident_report', $col)) {
                        $table->string($col)->nullable();
                    }
                }
            });
        }

        // users: add additional optional columns referenced by the model if missing
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $columns = [
                    'date_of_birth','civil_status','number_of_months_stay','telephone_number','fb_account','messenger_account','prepared_contact','caretaker_name','caretaker_address','caretaker_contact_number','caretaker_email','signature_image','incase_of_emergency'
                ];
                foreach ($columns as $col) {
                    if (!Schema::hasColumn('users', $col)) {
                        $table->string($col)->nullable();
                    }
                }
            });
        }
    }

    public function down(): void
    {
        // No down conversions provided to avoid data loss; safe to leave as-is
    }
};



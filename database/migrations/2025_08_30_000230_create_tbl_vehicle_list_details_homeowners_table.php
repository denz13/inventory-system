<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_vehicle_list_details_homeowners', function (Blueprint $table) {
            $table->id();
            $table->string('vehicle_homeowners_supporting_documents_id')->nullable();
            $table->string('plate_number')->nullable();
            $table->string('or_no')->nullable();
            $table->string('vehicle_model')->nullable();
            $table->string('cr_no')->nullable();
            $table->string('color_of_vehicle')->nullable();
            $table->string('vehicle_sticker_control_no')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_vehicle_list_details_homeowners');
    }
};



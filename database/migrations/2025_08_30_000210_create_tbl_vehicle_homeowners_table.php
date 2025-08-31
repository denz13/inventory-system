<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_vehicle_homeowners', function (Blueprint $table) {
            $table->id();
            $table->string('user_id')->nullable();
            $table->string('type_of_vehicle')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_vehicle_homeowners');
    }
};



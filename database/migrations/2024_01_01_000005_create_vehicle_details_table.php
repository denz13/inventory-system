<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicle_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_management_id')->nullable();
            $table->string('plate_number')->nullable();
            $table->string('or_number')->nullable();
            $table->string('cr_number')->nullable();
            $table->string('vehicle_model')->nullable();
            $table->string('color')->nullable();
            $table->string('sticker_control_number')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('vehicle_management_id')->references('id')->on('vehicle_management_list')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_details');
    }
};

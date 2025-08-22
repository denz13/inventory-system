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
        Schema::create('tbl_appointment', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->date('appointment_date');
            $table->string('tracking_number')->nullable();
            $table->text('remarks')->nullable();
            $table->enum('status', ['pending', 'approved', 'cancelled', 'completed'])->default('pending');
            $table->boolean('is_expired')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_appointment');
    }
};

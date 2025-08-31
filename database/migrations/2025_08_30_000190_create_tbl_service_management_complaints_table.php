<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_service_management_complaints', function (Blueprint $table) {
            $table->id();
            $table->string('service_management_category_id')->nullable();
            $table->string('user_id')->nullable();
            $table->string('complaint_description')->nullable();
            $table->string('status')->nullable();
            $table->string('reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_service_management_complaints');
    }
};



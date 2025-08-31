<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_otp', function (Blueprint $table) {
            $table->id();
            $table->string('user_id')->nullable();
            $table->string('email')->nullable();
            $table->string('otp_code')->nullable();
            $table->string('status')->nullable();
            $table->string('expire_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_otp');
    }
};



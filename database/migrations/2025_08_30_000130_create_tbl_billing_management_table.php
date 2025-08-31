<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_billing_management', function (Blueprint $table) {
            $table->id();
            $table->string('user_id')->nullable();
            $table->string('billing_date')->nullable();
            $table->string('receipt')->nullable();
            $table->string('amount_due')->nullable();
            $table->string('status')->nullable();
            $table->string('payment_account_id')->nullable();
            $table->string('reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_billing_management');
    }
};



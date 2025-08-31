<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_billing_management_list', function (Blueprint $table) {
            $table->id();
            $table->string('billing_management_id')->nullable();
            $table->string('description')->nullable();
            $table->string('qty')->nullable();
            $table->string('price')->nullable();
            $table->string('is_pay')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_billing_management_list');
    }
};



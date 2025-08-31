<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_tenant_list', function (Blueprint $table) {
            $table->id();
            $table->string('user_id')->nullable();
            $table->string('full_name')->nullable();
            $table->string('relationship')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->string('photo')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_tenant_list');
    }
};



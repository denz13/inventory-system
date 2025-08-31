<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_vehicle_homeowners_supporting_documents', function (Blueprint $table) {
            $table->id();
            $table->string('vehicle_homeowners_id')->nullable();
            $table->string('supporting_documents_attachments')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_vehicle_homeowners_supporting_documents');
    }
};



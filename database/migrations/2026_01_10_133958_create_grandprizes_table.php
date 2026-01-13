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
        Schema::create('grandprizes', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // Contoh: 'is_grandprize_active'
            $table->boolean('is_grandprize')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grandprizes');
    }
};

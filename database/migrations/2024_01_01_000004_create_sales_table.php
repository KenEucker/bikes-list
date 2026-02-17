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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->integer('price_cents');
            $table->string('currency', 3)->default('USD');
            $table->string('category')->nullable();
            $table->string('condition')->nullable();
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('frame_size')->nullable();
            $table->enum('status', ['draft', 'active', 'sold', 'expired', 'flagged'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['region_id', 'status', 'published_at']);
            $table->index(['region_id', 'price_cents']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};

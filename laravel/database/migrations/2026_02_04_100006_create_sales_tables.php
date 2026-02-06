<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('city_id')->constrained()->cascadeOnDelete();
            $table->foreignId('community_page_id')->nullable()->constrained('community_pages')->nullOnDelete();
            $table->string('type');
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2)->nullable();
            $table->string('condition')->nullable();
            $table->string('state')->default('draft');
            $table->string('location_address')->nullable();
            $table->decimal('location_lat', 10, 8)->nullable();
            $table->decimal('location_lng', 11, 8)->nullable();
            $table->json('attributes')->nullable();
            $table->string('serial_number')->nullable();
            $table->boolean('serial_private')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        Schema::create('sale_relay_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->cascadeOnDelete();
            $table->string('token')->unique();
            $table->timestamps();
        });

        Schema::create('sale_relay_threads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->cascadeOnDelete();
            $table->string('sender_email_hash');
            $table->string('reply_to_token')->unique();
            $table->timestamps();

            $table->unique(['sale_id', 'sender_email_hash']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_relay_threads');
        Schema::dropIfExists('sale_relay_addresses');
        Schema::dropIfExists('sales');
    }
};

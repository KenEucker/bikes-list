<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_pages', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // bike_shop, club, recurring_event
            $table->foreignId('city_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('about')->nullable();
            $table->text('event_info')->nullable();
            $table->text('sales_info')->nullable();
            $table->string('contact_address')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->decimal('contact_lat', 10, 8)->nullable();
            $table->decimal('contact_lng', 11, 8)->nullable();
            $table->string('state')->default('pending'); // pending, approved, removed
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('claimed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_pages');
    }
};

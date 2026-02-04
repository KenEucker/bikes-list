<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listing_relay_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->string('token')->unique();
            $table->timestamps();
        });

        Schema::create('listing_relay_threads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->string('sender_email_hash');
            $table->string('reply_to_token')->unique();
            $table->timestamps();

            $table->unique(['listing_id', 'sender_email_hash']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listing_relay_threads');
        Schema::dropIfExists('listing_relay_addresses');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('city_id')->constrained()->cascadeOnDelete();
            $table->foreignId('community_page_id')->nullable()->constrained('community_pages')->nullOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('organizer_name');
            $table->string('organizer_email');
            $table->boolean('organizer_email_hidden')->default(false);
            $table->string('state')->default('draft'); // draft, pending_review, published, removed
            $table->string('location_address')->nullable();
            $table->decimal('location_lat', 10, 8)->nullable();
            $table->decimal('location_lng', 11, 8)->nullable();
            $table->text('route_description')->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->string('timezone')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->timestamp('recurrence_ends_at')->nullable();
            $table->json('recurrence_rule')->nullable();
            $table->json('tags')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('guidelines_accepted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};

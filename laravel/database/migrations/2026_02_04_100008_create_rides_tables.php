<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ride_audiences', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->foreignId('city_id')->nullable()->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('ride_tags', function (Blueprint $table) {
            $table->id();
            $table->string('slug');
            $table->string('label');
            $table->foreignId('city_id')->nullable()->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['slug', 'city_id']);
        });

        Schema::create('rides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('city_id')->constrained()->cascadeOnDelete();
            $table->foreignId('community_page_id')->nullable()->constrained('community_pages')->nullOnDelete();
            $table->foreignId('audience_id')->nullable()->constrained('ride_audiences')->nullOnDelete();
            $table->string('name');
            $table->text('description');
            $table->string('organizer_name');
            $table->string('organizer_email');
            $table->boolean('organizer_email_hidden')->default(false);
            $table->string('state')->default('draft');
            $table->string('location_name')->nullable();
            $table->string('location_address')->nullable();
            $table->text('location_details')->nullable();
            $table->decimal('location_lat', 10, 8)->nullable();
            $table->decimal('location_lng', 11, 8)->nullable();
            $table->text('route_description')->nullable();
            $table->string('route_link', 500)->nullable();
            $table->string('route_length')->nullable();
            $table->boolean('is_loop')->default(false);
            $table->string('external_link', 500)->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at')->nullable();
            $table->string('timezone')->nullable();
            $table->text('time_details')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->timestamp('recurrence_ends_at')->nullable();
            $table->json('recurrence_rule')->nullable();
            $table->json('tags')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('guidelines_accepted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('ride_community_page', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ride_id')->constrained()->cascadeOnDelete();
            $table->foreignId('community_page_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['ride_id', 'community_page_id']);
        });

        Schema::create('ride_guideline_acceptances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ride_id')->constrained()->cascadeOnDelete();
            $table->foreignId('guideline_id')->constrained()->cascadeOnDelete();
            $table->timestamp('accepted_at');
            $table->timestamps();

            $table->unique(['ride_id', 'guideline_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ride_guideline_acceptances');
        Schema::dropIfExists('ride_community_page');
        Schema::dropIfExists('rides');
        Schema::dropIfExists('ride_tags');
        Schema::dropIfExists('ride_audiences');
    }
};

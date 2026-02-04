<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('route_link', 500)->nullable()->after('route_description');
            $table->string('external_link', 500)->nullable()->after('route_link');
            $table->string('event_type')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['route_link', 'external_link', 'event_type']);
        });
    }
};

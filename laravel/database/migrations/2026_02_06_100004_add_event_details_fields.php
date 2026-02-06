<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->text('time_details')->nullable()->after('timezone');
            $table->string('location_name')->nullable()->after('state');
            $table->text('location_details')->nullable()->after('location_address');
            $table->string('route_length')->nullable()->after('route_link');
            $table->boolean('is_loop')->default(false)->after('route_length');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['time_details', 'location_name', 'location_details', 'route_length', 'is_loop']);
        });
    }
};

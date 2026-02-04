<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->string('condition')->nullable()->after('price'); // new, like_new, good, fair, poor
            $table->string('serial_number')->nullable()->after('attributes');
            $table->boolean('serial_private')->default(true)->after('serial_number');
        });
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn(['condition', 'serial_number', 'serial_private']);
        });
    }
};

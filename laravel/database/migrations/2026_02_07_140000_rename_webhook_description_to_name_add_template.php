<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('webhook_endpoints', function (Blueprint $table) {
            $table->renameColumn('description', 'name');
        });

        Schema::table('webhook_endpoints', function (Blueprint $table) {
            $table->text('template')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('webhook_endpoints', function (Blueprint $table) {
            $table->dropColumn('template');
        });

        Schema::table('webhook_endpoints', function (Blueprint $table) {
            $table->renameColumn('name', 'description');
        });
    }
};

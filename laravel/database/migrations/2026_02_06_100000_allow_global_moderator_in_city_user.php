<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('city_user', function (Blueprint $table) {
            $table->dropForeign(['city_id']);
            $table->dropUnique(['city_id', 'user_id']);
        });

        Schema::table('city_user', function (Blueprint $table) {
            $table->unsignedBigInteger('city_id')->nullable()->change();
            $table->unique(['user_id', 'city_id']);
            $table->foreign('city_id')->references('id')->on('cities')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('city_user', function (Blueprint $table) {
            $table->dropForeign(['city_id']);
            $table->dropUnique(['user_id', 'city_id']);
        });

        Schema::table('city_user', function (Blueprint $table) {
            $table->unsignedBigInteger('city_id')->nullable(false)->change();
            $table->unique(['city_id', 'user_id']);
            $table->foreign('city_id')->references('id')->on('cities')->cascadeOnDelete();
        });
    }
};

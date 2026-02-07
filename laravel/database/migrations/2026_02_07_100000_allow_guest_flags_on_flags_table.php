<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('flags', function (Blueprint $table) {
            $table->string('session_id')->nullable()->after('user_id');
        });

        Schema::table('flags', function (Blueprint $table) {
            $table->dropUnique(['flaggable_type', 'flaggable_id', 'user_id']);
        });

        Schema::table('flags', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->change();
        });

        // One flag per (sale, user) for auth, or per (sale, session) for guests
        Schema::table('flags', function (Blueprint $table) {
            $table->unique(['flaggable_type', 'flaggable_id', 'user_id', 'session_id'], 'flags_flaggable_user_session_unique');
        });
    }

    public function down(): void
    {
        \App\Models\Flag::query()->whereNull('user_id')->delete();

        Schema::table('flags', function (Blueprint $table) {
            $table->dropUnique('flags_flaggable_user_session_unique');
        });

        Schema::table('flags', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
        });

        Schema::table('flags', function (Blueprint $table) {
            $table->unique(['flaggable_type', 'flaggable_id', 'user_id']);
        });

        Schema::table('flags', function (Blueprint $table) {
            $table->dropColumn('session_id');
        });
    }
};

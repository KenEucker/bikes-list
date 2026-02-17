<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('moderation_actions', function (Blueprint $table) {
            $table->string('reason_code')->nullable()->after('subject_id');
            $table->text('moderation_note')->nullable()->after('reason_code');
            $table->string('actor_role', 32)->nullable()->after('user_id');
            $table->string('previous_state', 64)->nullable()->after('metadata');
            $table->string('new_state', 64)->nullable()->after('previous_state');
        });

        \DB::table('moderation_actions')->whereNull('reason_code')->update(['reason_code' => 'OTHER']);

        Schema::table('moderation_actions', function (Blueprint $table) {
            $table->string('reason_code')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('moderation_actions', function (Blueprint $table) {
            $table->dropColumn(['reason_code', 'moderation_note', 'actor_role', 'previous_state', 'new_state']);
        });
    }
};

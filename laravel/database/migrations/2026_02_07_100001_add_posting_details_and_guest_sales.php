<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->string('contact_email')->nullable()->after('community_page_id');
            $table->string('frame_size')->nullable()->after('serial_private');
            $table->string('make')->nullable()->after('frame_size');
            $table->string('model')->nullable()->after('make');
            $table->string('bicycle_type')->nullable()->after('model');
            $table->string('wheel_size')->nullable()->after('bicycle_type');
            $table->string('frame_material')->nullable()->after('wheel_size');
            $table->string('suspension')->nullable()->after('frame_material');
            $table->string('handlebar_type')->nullable()->after('suspension');
            $table->string('electric_assist')->nullable()->after('handlebar_type');
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn([
                'contact_email',
                'frame_size',
                'make',
                'model',
                'bicycle_type',
                'wheel_size',
                'frame_material',
                'suspension',
                'handlebar_type',
                'electric_assist',
            ]);
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable(false)->change();
        });
    }
};

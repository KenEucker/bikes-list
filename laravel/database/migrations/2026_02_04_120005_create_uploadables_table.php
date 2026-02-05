<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('uploadables', function (Blueprint $table) {
            $table->id();
            $table->uuid('upload_id');
            $table->string('uploadable_type');
            $table->unsignedBigInteger('uploadable_id');
            $table->unsignedInteger('position')->default(0);

            $table->foreign('upload_id')->references('id')->on('uploads')->cascadeOnDelete();
            $table->index(['uploadable_type', 'uploadable_id']);
            $table->unique(['uploadable_type', 'uploadable_id', 'upload_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('uploadables');
    }
};

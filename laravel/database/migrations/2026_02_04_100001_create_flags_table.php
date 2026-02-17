<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flags', function (Blueprint $table) {
            $table->id();
            $table->string('flaggable_type');
            $table->unsignedBigInteger('flaggable_id');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('reason')->nullable();
            $table->timestamps();

            $table->unique(['flaggable_type', 'flaggable_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flags');
    }
};

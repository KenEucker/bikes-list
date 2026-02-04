<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_page_managers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_page_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('manager'); // owner, manager
            $table->timestamps();

            $table->unique(['community_page_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_page_managers');
    }
};

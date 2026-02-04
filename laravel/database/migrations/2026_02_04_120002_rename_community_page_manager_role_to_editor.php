<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('community_page_managers')->where('role', 'manager')->update(['role' => 'editor']);
    }

    public function down(): void
    {
        DB::table('community_page_managers')->where('role', 'editor')->update(['role' => 'manager']);
    }
};

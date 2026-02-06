<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();
        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE events ALTER COLUMN ends_at DROP NOT NULL');
        } else {
            DB::statement('ALTER TABLE events MODIFY ends_at TIMESTAMP NULL');
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();
        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE events ALTER COLUMN ends_at SET NOT NULL');
        } else {
            DB::statement('ALTER TABLE events MODIFY ends_at TIMESTAMP NOT NULL');
        }
    }
};

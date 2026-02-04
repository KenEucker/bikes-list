<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('community_pages', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('name');
            $table->boolean('featured')->default(false)->after('state');
        });

        // Backfill slug from name + id so we have unique slugs per city
        foreach (DB::table('community_pages')->orderBy('id')->get() as $page) {
            DB::table('community_pages')->where('id', $page->id)->update([
                'slug' => Str::slug($page->name ?? 'page') . '-' . $page->id,
            ]);
        }

        Schema::table('community_pages', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->change();
            $table->unique(['city_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::table('community_pages', function (Blueprint $table) {
            $table->dropUnique(['city_id', 'slug']);
            $table->dropColumn(['slug', 'featured']);
        });
    }
};

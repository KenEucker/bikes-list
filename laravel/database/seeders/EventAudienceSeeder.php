<?php

namespace Database\Seeders;

use App\Models\EventAudience;
use Illuminate\Database\Seeder;

class EventAudienceSeeder extends Seeder
{
    public function run(): void
    {
        $audiences = [
            ['name' => 'All Welcome', 'sort_order' => 0],
            ['name' => '21+', 'sort_order' => 1],
            ['name' => 'Family Friendly', 'sort_order' => 2],
        ];

        foreach ($audiences as $audience) {
            EventAudience::firstOrCreate(
                ['name' => $audience['name'], 'city_id' => null],
                ['sort_order' => $audience['sort_order']]
            );
        }
    }
}

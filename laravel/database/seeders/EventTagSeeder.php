<?php

namespace Database\Seeders;

use App\Models\EventTag;
use Illuminate\Database\Seeder;

class EventTagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            'no_drop' => 'No-drop',
            'costumes' => 'Costumes',
            'workout' => 'Workout',
            'race' => 'Race',
            'social' => 'Social',
        ];

        foreach ($tags as $slug => $label) {
            EventTag::firstOrCreate(
                ['slug' => $slug, 'city_id' => null],
                ['label' => $label]
            );
        }
    }
}

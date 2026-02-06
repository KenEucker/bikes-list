<?php

namespace Database\Seeders;

use App\Models\RideTag;
use Illuminate\Database\Seeder;

class RideTagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            'no_drop' => 'No-drop',
            'costumes' => 'Costumes',
            'workout' => 'Workout',
            'race' => 'Race',
            'social' => 'Social',
            'workshop' => 'Workshop',
            'meeting' => 'Meeting',
        ];

        foreach ($tags as $slug => $label) {
            RideTag::firstOrCreate(
                ['slug' => $slug, 'city_id' => null],
                ['label' => $label]
            );
        }
    }
}

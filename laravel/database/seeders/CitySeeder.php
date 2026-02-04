<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $path = base_path('../docs/locations.json');
        if (!File::exists($path)) {
            $path = database_path('data/locations.json');
        }
        if (!File::exists($path)) {
            $this->command->warn('Locations JSON not found. Tried: ' . base_path('../docs/locations.json') . ' and ' . database_path('data/locations.json') . '. Skipping city seed.');
            return;
        }

        $items = json_decode(File::get($path), true);
        if (!is_array($items)) {
            $this->command->error('Invalid JSON in locations.json');
            return;
        }

        foreach ($items as $item) {
            City::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['city'],
                    'description' => null,
                    'latitude' => $item['latitude'] ?? null,
                    'longitude' => $item['longitude'] ?? null,
                    'state_province' => $item['state_province'] ?? null,
                    'country' => $item['country'] ?? null,
                ]
            );
        }

        $this->command->info('Seeded ' . count($items) . ' cities.');
    }
}

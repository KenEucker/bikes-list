<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $cities = [
            ['name' => 'Austin', 'slug' => 'austin', 'description' => 'Capital of Texas.'],
            ['name' => 'Portland', 'slug' => 'portland', 'description' => 'City in Oregon.'],
            ['name' => 'Denver', 'slug' => 'denver', 'description' => 'Capital of Colorado.'],
            ['name' => 'Seattle', 'slug' => 'seattle', 'description' => 'Largest city in Washington.'],
            ['name' => 'Minneapolis', 'slug' => 'minneapolis', 'description' => 'Largest city in Minnesota.'],
        ];

        foreach ($cities as $city) {
            City::query()->updateOrCreate(
                ['slug' => $city['slug']],
                $city
            );
        }
    }
}

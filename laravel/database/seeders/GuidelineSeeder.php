<?php

namespace Database\Seeders;

use App\Models\Guideline;
use Illuminate\Database\Seeder;

class GuidelineSeeder extends Seeder
{
    public function run(): void
    {
        Guideline::updateOrCreate(
            ['name' => 'BikesList Guidelines'],
            [
                'body' => "Be kind, Don&#039;t be mean.<br /> Be accepting, Don&#039;t be exclusionary.<br /> Be safe, Don&#039;t be dangerous.",
                'published_at' => now(),
                'scope' => Guideline::SCOPE_SITEWIDE,
                'city_id' => null,
            ]
        );
    }
}

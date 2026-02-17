<?php

namespace Tests\Feature;

use App\Domain\Regions\Region;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegionResolutionTest extends TestCase
{
    use RefreshDatabase;

    public function test_region_subdomain_resolves_region(): void
    {
        $region = Region::create([
            'slug' => 'sf',
            'name' => 'San Francisco',
            'is_active' => true,
        ]);

        $response = $this->get('http://sf.bikeslist.org/');

        $response->assertStatus(200);
    }

    public function test_invalid_region_returns_404(): void
    {
        $response = $this->get('http://invalid.bikeslist.org/');

        $response->assertStatus(404);
    }

    public function test_inactive_region_returns_404(): void
    {
        $region = Region::create([
            'slug' => 'inactive',
            'name' => 'Inactive Region',
            'is_active' => false,
        ]);

        $response = $this->get('http://inactive.bikeslist.org/');

        $response->assertStatus(404);
    }
}

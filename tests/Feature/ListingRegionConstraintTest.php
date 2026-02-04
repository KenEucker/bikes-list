<?php

namespace Tests\Feature;

use App\Domain\Listings\Listing;
use App\Domain\Regions\Region;
use App\Domain\Auth\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListingRegionConstraintTest extends TestCase
{
    use RefreshDatabase;

    public function test_cannot_create_listing_without_region(): void
    {
        $user = User::create([
            'email' => 'user@example.com',
            'status' => 'active',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->post('/listings', [
            'title' => 'Test Listing',
            'description' => 'Test description',
            'price_cents' => 10000,
            'currency' => 'USD',
        ]);

        // Should fail validation or require region
        $response->assertStatus(422);
    }

    public function test_listing_query_in_region_only_returns_that_region(): void
    {
        $region1 = Region::create([
            'slug' => 'sf',
            'name' => 'San Francisco',
            'is_active' => true,
        ]);

        $region2 = Region::create([
            'slug' => 'nyc',
            'name' => 'New York',
            'is_active' => true,
        ]);

        $user = User::create([
            'email' => 'user@example.com',
            'status' => 'active',
        ]);

        $listing1 = Listing::create([
            'region_id' => $region1->id,
            'user_id' => $user->id,
            'title' => 'SF Listing',
            'description' => 'Description',
            'price_cents' => 10000,
            'currency' => 'USD',
            'status' => 'active',
            'published_at' => now(),
        ]);

        $listing2 = Listing::create([
            'region_id' => $region2->id,
            'user_id' => $user->id,
            'title' => 'NYC Listing',
            'description' => 'Description',
            'price_cents' => 10000,
            'currency' => 'USD',
            'status' => 'active',
            'published_at' => now(),
        ]);

        $sfListings = Listing::forRegion($region1->id)->get();
        $this->assertCount(1, $sfListings);
        $this->assertEquals($listing1->id, $sfListings->first()->id);
    }
}

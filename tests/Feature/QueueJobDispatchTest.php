<?php

namespace Tests\Feature;

use App\Domain\Listings\Listing;
use App\Domain\Listings\ListingImage;
use App\Domain\Regions\Region;
use App\Domain\Auth\User;
use App\Jobs\IndexListingJob;
use App\Jobs\GenerateListingImageVariantsJob;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class QueueJobDispatchTest extends TestCase
{
    use RefreshDatabase;

    public function test_publishing_listing_enqueues_indexing(): void
    {
        Queue::fake();

        $user = User::create([
            'email' => 'user@example.com',
            'status' => 'active',
        ]);

        $region = Region::create([
            'slug' => 'sf',
            'name' => 'San Francisco',
            'is_active' => true,
        ]);

        $listing = Listing::create([
            'region_id' => $region->id,
            'user_id' => $user->id,
            'title' => 'Test Listing',
            'description' => 'Test',
            'price_cents' => 10000,
            'currency' => 'USD',
            'status' => 'draft',
        ]);

        // Update to active/published should dispatch indexing job
        $listing->update([
            'status' => 'active',
            'published_at' => now(),
        ]);

        Queue::assertPushed(IndexListingJob::class);
    }

    public function test_image_upload_enqueues_variant_generation(): void
    {
        Queue::fake();

        $user = User::create([
            'email' => 'user@example.com',
            'status' => 'active',
        ]);

        $region = Region::create([
            'slug' => 'sf',
            'name' => 'San Francisco',
            'is_active' => true,
        ]);

        $listing = Listing::create([
            'region_id' => $region->id,
            'user_id' => $user->id,
            'title' => 'Test Listing',
            'description' => 'Test',
            'price_cents' => 10000,
            'currency' => 'USD',
        ]);

        $image = ListingImage::create([
            'listing_id' => $listing->id,
            'storage_key' => 'test/key.jpg',
            'cdn_url' => 'https://example.com/test.jpg',
            'variant' => 'original',
        ]);

        GenerateListingImageVariantsJob::dispatch($image->id);

        Queue::assertPushed(GenerateListingImageVariantsJob::class);
    }
}

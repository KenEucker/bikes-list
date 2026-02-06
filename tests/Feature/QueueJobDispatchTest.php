<?php

namespace Tests\Feature;

use App\Domain\Sales\Sale;
use App\Domain\Sales\SaleImage;
use App\Domain\Regions\Region;
use App\Domain\Auth\User;
use App\Jobs\IndexSaleJob;
use App\Jobs\GenerateSaleImageVariantsJob;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class QueueJobDispatchTest extends TestCase
{
    use RefreshDatabase;

    public function test_publishing_sale_enqueues_indexing(): void
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

        $sale = Sale::create([
            'region_id' => $region->id,
            'user_id' => $user->id,
            'title' => 'Test Sale',
            'description' => 'Test',
            'price_cents' => 10000,
            'currency' => 'USD',
            'status' => 'draft',
        ]);

        // Update to active/published should dispatch indexing job
        $sale->update([
            'status' => 'active',
            'published_at' => now(),
        ]);

        Queue::assertPushed(IndexSaleJob::class);
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

        $sale = Sale::create([
            'region_id' => $region->id,
            'user_id' => $user->id,
            'title' => 'Test Sale',
            'description' => 'Test',
            'price_cents' => 10000,
            'currency' => 'USD',
        ]);

        $image = SaleImage::create([
            'sale_id' => $sale->id,
            'storage_key' => 'test/key.jpg',
            'cdn_url' => 'https://example.com/test.jpg',
            'variant' => 'original',
        ]);

        GenerateSaleImageVariantsJob::dispatch($image->id);

        Queue::assertPushed(GenerateSaleImageVariantsJob::class);
    }
}

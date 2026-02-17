<?php

namespace Tests\Feature\Webhooks;

use App\Events\SaleCreated;
use App\Models\City;
use App\Models\Sale;
use App\Models\User;
use App\Models\WebhookEndpoint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class WebhookDispatchTest extends TestCase
{
    use RefreshDatabase;

    public function test_dispatching_sale_created_triggers_delivery_jobs_for_subscribed_endpoints(): void
    {
        Queue::fake();

        $city = City::query()->first() ?? City::query()->create([
            'name' => 'Test City',
            'slug' => 'test',
            'description' => null,
            'latitude' => null,
            'longitude' => null,
            'state_province' => null,
            'country' => null,
        ]);
        $user = User::factory()->create();
        $sale = Sale::query()->create([
            'user_id' => $user->id,
            'city_id' => $city->id,
            'type' => 'bicycle',
            'title' => 'Test Sale',
            'description' => 'Description',
            'state' => Sale::STATE_PUBLISHED,
        ]);

        $endpoint = WebhookEndpoint::query()->create([
            'url' => 'https://example.com/webhook',
            'secret' => 'test-secret',
            'events' => ['sale.created'],
            'is_active' => true,
        ]);

        SaleCreated::dispatch($sale);

        Queue::assertPushed(\App\Jobs\DeliverWebhookJob::class, function ($job) use ($endpoint) {
            return $job->endpoint->id === $endpoint->id
                && $job->eventName === 'sale.created';
        });
    }

    public function test_dispatching_event_with_no_matching_endpoints_dispatches_no_jobs(): void
    {
        Queue::fake();

        $city = City::query()->first() ?? City::query()->create([
            'name' => 'Test City',
            'slug' => 'test',
            'description' => null,
            'latitude' => null,
            'longitude' => null,
            'state_province' => null,
            'country' => null,
        ]);
        $user = User::factory()->create();
        $sale = Sale::query()->create([
            'user_id' => $user->id,
            'city_id' => $city->id,
            'type' => 'bicycle',
            'title' => 'Test Sale',
            'description' => 'Description',
            'state' => Sale::STATE_PUBLISHED,
        ]);

        WebhookEndpoint::query()->create([
            'url' => 'https://example.com/webhook',
            'secret' => 'test-secret',
            'events' => ['ride.created'],
            'is_active' => true,
        ]);

        SaleCreated::dispatch($sale);

        Queue::assertNotPushed(\App\Jobs\DeliverWebhookJob::class);
    }

    public function test_inactive_endpoints_are_not_triggered(): void
    {
        Queue::fake();

        $city = City::query()->first() ?? City::query()->create([
            'name' => 'Test City',
            'slug' => 'test',
            'description' => null,
            'latitude' => null,
            'longitude' => null,
            'state_province' => null,
            'country' => null,
        ]);
        $user = User::factory()->create();
        $sale = Sale::query()->create([
            'user_id' => $user->id,
            'city_id' => $city->id,
            'type' => 'bicycle',
            'title' => 'Test Sale',
            'description' => 'Description',
            'state' => Sale::STATE_PUBLISHED,
        ]);

        WebhookEndpoint::query()->create([
            'url' => 'https://example.com/webhook',
            'secret' => 'test-secret',
            'events' => ['sale.created'],
            'is_active' => false,
        ]);

        SaleCreated::dispatch($sale);

        Queue::assertNotPushed(\App\Jobs\DeliverWebhookJob::class);
    }
}

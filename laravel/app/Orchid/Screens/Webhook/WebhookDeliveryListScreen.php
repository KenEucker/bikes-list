<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Webhook;

use App\Models\WebhookEndpoint;
use App\Models\WebhookDelivery;
use App\Orchid\Layouts\Webhook\WebhookDeliveryListLayout;
use Orchid\Screen\Screen;

class WebhookDeliveryListScreen extends Screen
{
    public function query(WebhookEndpoint $endpoint): iterable
    {
        return [
            'endpoint' => $endpoint,
            'deliveries' => WebhookDelivery::query()
                ->where('webhook_endpoint_id', $endpoint->id)
                ->orderByDesc('created_at')
                ->paginate(25),
        ];
    }

    public function name(): ?string
    {
        return __('Webhook deliveries');
    }

    public function description(): ?string
    {
        return __('Delivery log for this endpoint.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.webhooks'];
    }

    public function layout(): iterable
    {
        return [
            WebhookDeliveryListLayout::class,
        ];
    }
}

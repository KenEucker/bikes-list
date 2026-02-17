<?php

namespace App\Webhooks;

use App\Jobs\DeliverWebhookJob;
use App\Models\WebhookEndpoint;

class WebhookDispatcher
{
    public function dispatch(string $eventName, array $payload): void
    {
        $endpoints = WebhookEndpoint::query()
            ->active()
            ->subscribedTo($eventName)
            ->get();

        $queue = config('webhooks.queue', 'webhooks');

        foreach ($endpoints as $endpoint) {
            DeliverWebhookJob::dispatch($endpoint, $eventName, $payload)->onQueue($queue);
        }
    }

    public function buildPayload(string $eventName, object $model): array
    {
        $payload = $this->serializeModelForEvent($eventName, $model);

        return [
            'event' => $eventName,
            'timestamp' => now()->utc()->toIso8601String(),
            'data' => $payload,
        ];
    }

    private function serializeModelForEvent(string $eventName, object $model): array
    {
        if ($model instanceof \App\Models\Sale) {
            return \App\Webhooks\Payloads\SalePayload::fromModel($model);
        }
        if ($model instanceof \App\Models\Ride) {
            return \App\Webhooks\Payloads\RidePayload::fromModel($model);
        }

        return [];
    }
}

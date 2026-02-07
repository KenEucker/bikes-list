<?php

namespace App\Webhooks;

use App\Events\RideCreated;
use App\Events\SaleCreated;
use Illuminate\Contracts\Events\Dispatcher;

class WebhookEventSubscriber
{
    public function __construct(
        private WebhookDispatcher $dispatcher
    ) {}

    public function subscribe(Dispatcher $events): array
    {
        return [
            SaleCreated::class => 'handleSaleCreated',
            RideCreated::class => 'handleRideCreated',
        ];
    }

    public function handleSaleCreated(SaleCreated $event): void
    {
        $payload = $this->dispatcher->buildPayload($event->broadcastAs(), $event->sale);
        $this->dispatcher->dispatch($event->broadcastAs(), $payload);
    }

    public function handleRideCreated(RideCreated $event): void
    {
        $payload = $this->dispatcher->buildPayload($event->broadcastAs(), $event->ride);
        $this->dispatcher->dispatch($event->broadcastAs(), $payload);
    }
}

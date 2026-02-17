<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Webhook;

use App\Models\WebhookDelivery;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class WebhookDeliveryListLayout extends Table
{
    protected $target = 'deliveries';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('id', __('ID'))->width('80px'),
            TD::make('event_name', __('Event')),
            TD::make('response_status', __('Status'))
                ->render(fn (WebhookDelivery $d) => $d->response_status ?? '—'),
            TD::make('attempt', __('Attempt')),
            TD::make('delivered_at', __('Delivered'))
                ->render(fn (WebhookDelivery $d) => $d->delivered_at?->toDateTimeString() ?? '—'),
            TD::make('failed_at', __('Failed'))
                ->render(fn (WebhookDelivery $d) => $d->failed_at?->toDateTimeString() ?? '—'),
            TD::make('created_at', __('Created'))
                ->render(fn (WebhookDelivery $d) => $d->created_at->toDateTimeString()),
        ];
    }
}

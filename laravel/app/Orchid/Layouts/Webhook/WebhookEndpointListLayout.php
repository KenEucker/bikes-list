<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Webhook;

use App\Models\WebhookEndpoint;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Components\Cells\Boolean;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class WebhookEndpointListLayout extends Table
{
    protected $target = 'webhook_endpoints';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('id', __('ID'))
                ->sort()
                ->width('80px'),
            TD::make('name', __('Name'))
                ->sort()
                ->render(fn (WebhookEndpoint $e) => $e->name ?? '—'),
            TD::make('url', __('URL'))
                ->render(fn (WebhookEndpoint $e) => strlen($e->url) > 50 ? substr($e->url, 0, 50) . '…' : $e->url)
                ->popover(__('Full URL'), fn (WebhookEndpoint $e) => $e->url),
            TD::make('events', __('Events'))
                ->render(fn (WebhookEndpoint $e) => implode(', ', $e->events ?? [])),
            TD::make('is_active', __('Active'))
                ->usingComponent(Boolean::class)
                ->sort(),
            TD::make('failure_count', __('Failures'))
                ->sort(),
            TD::make('last_triggered_at', __('Last triggered'))
                ->sort()
                ->render(fn (WebhookEndpoint $e) => $e->last_triggered_at?->toDateTimeString() ?? '—'),
            TD::make('actions', __('Actions'))
                ->render(fn (WebhookEndpoint $e) => DropDown::make()
                    ->icon('bs.three-dots-vertical')
                    ->list([
                        Link::make(__('Edit'))
                            ->route('platform.systems.webhooks.edit', $e)
                            ->icon('bs.pencil'),
                        Button::make(__('Clone'))
                            ->icon('bs.copy')
                            ->method('clone', ['endpoint' => $e->id]),
                        Link::make(__('Deliveries'))
                            ->route('platform.systems.webhooks.deliveries', $e)
                            ->icon('bs.inbox'),
                        Button::make(__('Delete'))
                            ->icon('bs.trash3')
                            ->confirm(__('Delete this webhook endpoint? Deliveries will be removed and the URL will stop receiving events.'))
                            ->method('remove', ['endpoint' => $e->id]),
                    ])),
        ];
    }
}

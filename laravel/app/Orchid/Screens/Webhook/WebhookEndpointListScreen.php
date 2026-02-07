<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Webhook;

use App\Models\WebhookEndpoint;
use App\Orchid\Layouts\Webhook\WebhookEndpointListLayout;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Toast;

class WebhookEndpointListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'webhook_endpoints' => WebhookEndpoint::query()
                ->with('user')
                ->orderByDesc('updated_at')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Webhook endpoints');
    }

    public function description(): ?string
    {
        return __('Configure webhook URLs to receive event notifications.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.webhooks'];
    }

    public function commandBar(): iterable
    {
        return [
            Link::make(__('Create webhook'))
                ->icon('bs.plus-circle')
                ->route('platform.systems.webhooks.create'),
        ];
    }

    public function layout(): iterable
    {
        return [
            WebhookEndpointListLayout::class,
        ];
    }

    public function remove(Request $request): void
    {
        WebhookEndpoint::findOrFail($request->get('endpoint'))->delete();
        Toast::info(__('Webhook endpoint was removed.'));
    }

    public function clone(Request $request): RedirectResponse
    {
        $endpoint = WebhookEndpoint::findOrFail($request->get('endpoint'));

        $clone = new WebhookEndpoint;
        $clone->user_id = $endpoint->user_id;
        $clone->url = $endpoint->url;
        $clone->secret = Str::random(40);
        $clone->name = __('Copy of :name', ['name' => $endpoint->name ?? __('Webhook')]);
        $clone->template = $endpoint->template;
        $clone->events = $endpoint->events ?? [];
        $clone->is_active = $endpoint->is_active;

        $clone->save();

        Toast::success(__('Webhook cloned. New secret has been generated.'));

        return redirect()->route('platform.systems.webhooks.edit', $clone);
    }
}

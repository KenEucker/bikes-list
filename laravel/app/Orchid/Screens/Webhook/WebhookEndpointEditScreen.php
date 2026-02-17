<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Webhook;

use App\Models\WebhookEndpoint;
use App\Webhooks\WebhookTemplateRenderer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\CheckBox;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class WebhookEndpointEditScreen extends Screen
{
    public ?string $template_variables_hint = null;

    public function query(?WebhookEndpoint $endpoint = null): iterable
    {
        $endpoint = $endpoint ?? new WebhookEndpoint([
            'events' => [],
            'is_active' => true,
        ]);

        $supported = config('webhooks.supported_events', []);
        $endpointEvents = $endpoint->events ?? [];
        $event_selections = [];
        foreach ($supported as $event) {
            $key = str_replace('.', '_', $event);
            $event_selections[$key] = in_array($event, $endpointEvents, true) ? 1 : 0;
        }

        $templateVariablesHint = implode(', ', WebhookTemplateRenderer::variablesForEvents($endpointEvents));

        return [
            'endpoint' => [
                'name' => $endpoint->name ?? '',
                'url' => $endpoint->url ?? '',
                'template' => $endpoint->template ?? '',
                'is_active' => (bool) ($endpoint->is_active ?? true),
            ],
            'endpoint_model' => $endpoint,
            'supported_events' => config('webhooks.supported_events', []),
            'event_selections' => $event_selections,
            'template_variables_hint' => $templateVariablesHint,
        ];
    }

    public function name(): ?string
    {
        $model = $this->endpoint_model ?? new WebhookEndpoint;

        return $model->exists ? __('Edit webhook endpoint') : __('Create webhook endpoint');
    }

    public function description(): ?string
    {
        return __('Configure URL, events and secret for webhook deliveries.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.webhooks'];
    }

    public function commandBar(): array
    {
        $model = $this->endpoint_model ?? new WebhookEndpoint;

        return [
            Button::make(__('Save'))
                ->icon('bs.check-circle')
                ->method('save'),
            Button::make(__('Clone'))
                ->icon('bs.copy')
                ->method('clone')
                ->canSee($model->exists),
            Button::make(__('Delete'))
                ->icon('bs.trash3')
                ->method('remove')
                ->confirm(__('Delete this webhook endpoint? Deliveries will be removed and the URL will stop receiving events.'))
                ->canSee($model->exists),
        ];
    }

    public function layout(): iterable
    {
        $events = config('webhooks.supported_events', []);
        $eventCheckboxes = [];
        foreach ($events as $event) {
            $key = str_replace('.', '_', $event);
            $eventCheckboxes[] = CheckBox::make('event_selections.' . $key)
                ->value(1)
                ->title($event)
                ->placeholder($event);
        }

        return [
            Layout::rows([
                Input::make('endpoint.name')
                    ->title(__('Name'))
                    ->placeholder(__('e.g. Discord #sales channel, Generic audit log')),
                Input::make('endpoint.url')
                    ->type('url')
                    ->title(__('Webhook URL'))
                    ->required()
                    ->placeholder('https://example.com/webhook'),
                ...$eventCheckboxes,
                TextArea::make('endpoint.template')
                    ->title(__('Payload template'))
                    ->placeholder('{"content": "{{ event }}: {{ data.title }}"}')
                    ->rows(8)
                    ->help(__('JSON body template. Use {{ variable }} syntax. Available: ') . ($this->template_variables_hint ?? 'event, timestamp, delivery_id')),
                CheckBox::make('endpoint.is_active')
                    ->title(__('Active'))
                    ->value(1)
                    ->placeholder(__('Endpoint is active and will receive deliveries'))
                    ->sendTrueOrFalse(),
            ]),
        ];
    }

    public function save(Request $request, ?WebhookEndpoint $endpoint = null): RedirectResponse
    {
        $endpoint = $endpoint ?? new WebhookEndpoint;
        $eventSelections = $request->input('event_selections', []);
        $selectedKeys = is_array($eventSelections) ? array_keys(array_filter($eventSelections)) : [];
        $supported = config('webhooks.supported_events', []);
        $selectedEvents = array_map(fn (string $key) => str_replace('_', '.', $key), $selectedKeys);
        $events = array_values(array_intersect($selectedEvents, $supported));

        $validated = $request->validate([
            'endpoint.url' => 'required|url',
            'endpoint.name' => 'nullable|string|max:255',
            'endpoint.template' => 'nullable|string',
        ]);

        $endpoint->url = $validated['endpoint']['url'];
        $endpoint->name = $validated['endpoint']['name'] ?? null;
        $endpoint->template = $validated['endpoint']['template'] ?? null;
        $endpoint->events = $events;
        $endpoint->is_active = $request->boolean('endpoint.is_active');

        if (! $endpoint->exists) {
            $endpoint->secret = Str::random(40);
        }

        $endpoint->save();

        if ($endpoint->wasRecentlyCreated) {
            Toast::success(__('Webhook endpoint created. Secret (save it now, it won’t be shown again): ') . $endpoint->secret);
        } else {
            Toast::success(__('Webhook endpoint updated.'));
        }

        return redirect()->route('platform.systems.webhooks.edit', $endpoint);
    }

    public function remove(WebhookEndpoint $endpoint): RedirectResponse
    {
        $endpoint->delete();
        Toast::info(__('Webhook endpoint deleted.'));

        return redirect()->route('platform.systems.webhooks');
    }

    public function clone(WebhookEndpoint $endpoint): RedirectResponse
    {
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

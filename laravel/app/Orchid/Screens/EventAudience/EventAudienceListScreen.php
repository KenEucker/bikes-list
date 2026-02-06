<?php

declare(strict_types=1);

namespace App\Orchid\Screens\EventAudience;

use App\Models\EventAudience;
use App\Orchid\Layouts\EventAudience\EventAudienceListLayout;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;

class EventAudienceListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'audiences' => EventAudience::query()
                ->with('city')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Event audiences');
    }

    public function description(): ?string
    {
        return __('Audience options for events (e.g. All Welcome, 21+, Family Friendly). Global or city-specific.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.event-audiences'];
    }

    public function commandBar(): iterable
    {
        return [
            Link::make(__('Add audience'))
                ->icon('bs.plus-circle')
                ->route('platform.systems.event-audiences.create'),
        ];
    }

    public function layout(): iterable
    {
        return [
            EventAudienceListLayout::class,
        ];
    }
}

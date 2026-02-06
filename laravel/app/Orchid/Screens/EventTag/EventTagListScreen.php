<?php

declare(strict_types=1);

namespace App\Orchid\Screens\EventTag;

use App\Models\EventTag;
use App\Orchid\Layouts\EventTag\EventTagListLayout;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;

class EventTagListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'tags' => EventTag::query()
                ->with('city')
                ->orderBy('label')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Event tags');
    }

    public function description(): ?string
    {
        return __('Tags for events (e.g. No-drop, Race, Social). Global or city-specific. Admins can add and edit.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.event-tags'];
    }

    public function commandBar(): iterable
    {
        return [
            Link::make(__('Add tag'))
                ->icon('bs.plus-circle')
                ->route('platform.systems.event-tags.create'),
        ];
    }

    public function layout(): iterable
    {
        return [
            EventTagListLayout::class,
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Event;

use App\Models\Event;
use App\Orchid\Layouts\Event\EventListLayout;
use Orchid\Screen\Screen;

class EventListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'events' => Event::query()
                ->with(['city', 'user'])
                ->orderByDesc('updated_at')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Events');
    }

    public function description(): ?string
    {
        return __('All events.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.events'];
    }

    public function layout(): iterable
    {
        return [
            EventListLayout::class,
        ];
    }
}

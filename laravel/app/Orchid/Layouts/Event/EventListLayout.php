<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Event;

use App\Models\Event;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Components\Cells\DateTimeSplit;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class EventListLayout extends Table
{
    protected $target = 'events';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('id', __('ID'))->sort()->width('80px'),
            TD::make('name', __('Name'))
                ->sort()
                ->render(fn (Event $event) => Link::make($event->name)->route('platform.systems.events.edit', $event)),
            TD::make('city', __('City'))->render(fn (Event $event) => $event->city?->name),
            TD::make('state', __('State'))->sort(),
            TD::make('starts_at', __('Starts'))->usingComponent(DateTimeSplit::class)->sort(),
            TD::make('user', __('User'))->render(fn (Event $event) => $event->user?->name),
        ];
    }
}

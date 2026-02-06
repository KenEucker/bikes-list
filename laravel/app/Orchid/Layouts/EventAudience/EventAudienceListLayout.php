<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\EventAudience;

use App\Models\EventAudience;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class EventAudienceListLayout extends Table
{
    protected $target = 'audiences';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('id', __('ID'))->sort()->width('80px'),
            TD::make('name', __('Name'))
                ->sort()
                ->render(fn (EventAudience $a) => Link::make($a->name)->route('platform.systems.event-audiences.edit', $a)),
            TD::make('sort_order', __('Sort order'))->sort(),
            TD::make('city_id', __('Scope'))->render(fn (EventAudience $a) => $a->city_id ? $a->city?->name : __('Global')),
        ];
    }
}

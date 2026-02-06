<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\EventTag;

use App\Models\EventTag;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class EventTagListLayout extends Table
{
    protected $target = 'tags';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('id', __('ID'))->sort()->width('80px'),
            TD::make('slug', __('Slug'))
                ->sort()
                ->render(fn (EventTag $t) => Link::make($t->slug)->route('platform.systems.event-tags.edit', $t)),
            TD::make('label', __('Label'))->sort(),
            TD::make('city_id', __('Scope'))->render(fn (EventTag $t) => $t->city_id ? $t->city?->name : __('Global')),
        ];
    }
}

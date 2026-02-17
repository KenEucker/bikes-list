<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\RideAudience;

use App\Models\RideAudience;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class RideAudienceListLayout extends Table
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
                ->render(fn (RideAudience $a) => Link::make($a->name)->route('platform.systems.ride-audiences.edit', $a)),
            TD::make('sort_order', __('Sort order'))->sort(),
            TD::make('city_id', __('Scope'))->render(fn (RideAudience $a) => $a->city_id ? $a->city?->name : __('Global')),
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Ride;

use App\Models\Ride;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Components\Cells\DateTimeSplit;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class RideListLayout extends Table
{
    protected $target = 'rides';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('id', __('ID'))->sort()->width('80px'),
            TD::make('name', __('Name'))
                ->sort()
                ->render(fn (Ride $ride) => Link::make($ride->name)->route('platform.systems.rides.edit', $ride)),
            TD::make('city', __('City'))->render(fn (Ride $ride) => $ride->city?->name),
            TD::make('state', __('State'))->sort(),
            TD::make('starts_at', __('Starts'))->usingComponent(DateTimeSplit::class)->sort(),
            TD::make('user', __('User'))->render(fn (Ride $ride) => $ride->user?->name),
        ];
    }
}

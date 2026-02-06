<?php

declare(strict_types=1);

namespace App\Orchid\Screens\RideAudience;

use App\Models\RideAudience;
use App\Orchid\Layouts\RideAudience\RideAudienceListLayout;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;

class RideAudienceListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'audiences' => RideAudience::query()
                ->with('city')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Ride audiences');
    }

    public function description(): ?string
    {
        return __('Audience options for rides (e.g. All Welcome, 21+, Family Friendly). Global or city-specific.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.ride-audiences'];
    }

    public function commandBar(): iterable
    {
        return [
            Link::make(__('Add audience'))
                ->icon('bs.plus-circle')
                ->route('platform.systems.ride-audiences.create'),
        ];
    }

    public function layout(): iterable
    {
        return [
            RideAudienceListLayout::class,
        ];
    }
}

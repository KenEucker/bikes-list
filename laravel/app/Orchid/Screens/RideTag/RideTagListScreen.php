<?php

declare(strict_types=1);

namespace App\Orchid\Screens\RideTag;

use App\Models\RideTag;
use App\Orchid\Layouts\RideTag\RideTagListLayout;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;

class RideTagListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'tags' => RideTag::query()
                ->with('city')
                ->orderBy('label')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Ride tags');
    }

    public function description(): ?string
    {
        return __('Tags for rides (e.g. No-drop, Race, Social). Global or city-specific. Admins can add and edit.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.ride-tags'];
    }

    public function commandBar(): iterable
    {
        return [
            Link::make(__('Add tag'))
                ->icon('bs.plus-circle')
                ->route('platform.systems.ride-tags.create'),
        ];
    }

    public function layout(): iterable
    {
        return [
            RideTagListLayout::class,
        ];
    }
}

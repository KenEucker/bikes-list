<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Ride;

use App\Models\Ride;
use App\Orchid\Layouts\Ride\RideListLayout;
use Orchid\Screen\Screen;

class RideListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'rides' => Ride::query()
                ->with(['city', 'user'])
                ->orderByDesc('updated_at')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Rides');
    }

    public function description(): ?string
    {
        return __('All rides.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.rides'];
    }

    public function layout(): iterable
    {
        return [
            RideListLayout::class,
        ];
    }
}

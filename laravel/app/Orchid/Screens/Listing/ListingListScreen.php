<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Listing;

use App\Models\Listing;
use App\Orchid\Layouts\Listing\ListingListLayout;
use Orchid\Screen\Screen;

class ListingListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'listings' => Listing::query()
                ->with(['city', 'user'])
                ->orderByDesc('updated_at')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Listings');
    }

    public function description(): ?string
    {
        return __('All classified listings.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.listings'];
    }

    public function layout(): iterable
    {
        return [
            ListingListLayout::class,
        ];
    }
}

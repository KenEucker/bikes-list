<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Listing;

use App\Models\Listing;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Components\Cells\DateTimeSplit;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class ListingListLayout extends Table
{
    protected $target = 'listings';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('id', __('ID'))
                ->sort()
                ->width('80px'),
            TD::make('title', __('Title'))
                ->sort()
                ->render(fn (Listing $listing) => Link::make($listing->title)->route('platform.systems.listings.edit', $listing)),
            TD::make('city', __('City'))
                ->render(fn (Listing $listing) => $listing->city?->name),
            TD::make('type', __('Type'))
                ->sort(),
            TD::make('state', __('State'))
                ->sort(),
            TD::make('price', __('Price'))
                ->render(fn (Listing $listing) => $listing->price !== null ? '$' . number_format((float) $listing->price, 2) : 'Free'),
            TD::make('user', __('User'))
                ->render(fn (Listing $listing) => $listing->user?->name),
            TD::make('published_at', __('Published'))
                ->usingComponent(DateTimeSplit::class)
                ->sort(),
            TD::make('updated_at', __('Updated'))
                ->usingComponent(DateTimeSplit::class)
                ->sort(),
        ];
    }
}

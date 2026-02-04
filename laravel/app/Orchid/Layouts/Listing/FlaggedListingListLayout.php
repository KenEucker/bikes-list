<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Listing;

use App\Models\Listing;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Components\Cells\DateTimeSplit;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class FlaggedListingListLayout extends Table
{
    protected $target = 'listings';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('id', __('ID'))->sort()->width('80px'),
            TD::make('title', __('Title'))
                ->render(fn (Listing $listing) => Link::make($listing->title)->route('platform.systems.listings.edit', $listing)),
            TD::make('city', __('City'))->render(fn (Listing $listing) => $listing->city?->name),
            TD::make('state', __('State')),
            TD::make('flags_count', __('Flags'))->render(fn (Listing $listing) => $listing->flags_count ?? 0),
            TD::make('updated_at', __('Updated'))->usingComponent(DateTimeSplit::class)->sort(),
            TD::make(__('Actions'))
                ->align(TD::ALIGN_CENTER)
                ->width('120px')
                ->render(fn (Listing $listing) => DropDown::make()
                    ->icon('bs.three-dots-vertical')
                    ->list([
                        Link::make(__('View / Edit'))
                            ->route('platform.systems.listings.edit', $listing)
                            ->icon('bs.pencil'),
                        Button::make(__('Revert to draft'))
                            ->icon('bs.arrow-counterclockwise')
                            ->method('revertToDraft', ['listing' => $listing->id])
                            ->canSee($listing->state === Listing::STATE_PUBLISHED),
                        Button::make(__('Remove'))
                            ->icon('bs.trash3')
                            ->confirm(__('Remove this listing from public view?'))
                            ->method('remove', ['listing' => $listing->id]),
                    ])),
        ];
    }
}

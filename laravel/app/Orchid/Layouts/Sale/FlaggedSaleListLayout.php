<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Sale;

use App\Models\Sale;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Components\Cells\DateTimeSplit;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class FlaggedSaleListLayout extends Table
{
    protected $target = 'sales';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('id', __('ID'))->sort()->width('80px'),
            TD::make('title', __('Title'))
                ->render(fn (Sale $sale) => Link::make($sale->title)->route('platform.systems.sales.edit', $sale)),
            TD::make('city', __('City'))->render(fn (Sale $sale) => $sale->city?->name),
            TD::make('state', __('State')),
            TD::make('flags_count', __('Flags'))->render(fn (Sale $sale) => $sale->flags_count ?? 0),
            TD::make('updated_at', __('Updated'))->usingComponent(DateTimeSplit::class)->sort(),
            TD::make(__('Actions'))
                ->align(TD::ALIGN_CENTER)
                ->width('120px')
                ->render(fn (Sale $sale) => DropDown::make()
                    ->icon('bs.three-dots-vertical')
                    ->list([
                        Link::make(__('View / Edit'))
                            ->route('platform.systems.sales.edit', $sale)
                            ->icon('bs.pencil'),
                        Button::make(__('Revert to draft'))
                            ->icon('bs.arrow-counterclockwise')
                            ->method('revertToDraft', ['sale' => $sale->id])
                            ->canSee($sale->state === Sale::STATE_PUBLISHED),
                        Button::make(__('Remove'))
                            ->icon('bs.trash3')
                            ->confirm(__('Remove this sale from public view?'))
                            ->method('remove', ['sale' => $sale->id]),
                    ])),
        ];
    }
}

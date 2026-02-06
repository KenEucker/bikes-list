<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Sale;

use App\Models\Sale;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Components\Cells\DateTimeSplit;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class SaleListLayout extends Table
{
    protected $target = 'sales';

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
                ->render(fn (Sale $sale) => Link::make($sale->title)->route('platform.systems.sales.edit', $sale)),
            TD::make('city', __('City'))
                ->render(fn (Sale $sale) => $sale->city?->name),
            TD::make('type', __('Type'))
                ->sort(),
            TD::make('state', __('State'))
                ->sort(),
            TD::make('price', __('Price'))
                ->render(fn (Sale $sale) => $sale->price !== null ? '$' . number_format((float) $sale->price, 2) : 'Free'),
            TD::make('user', __('User'))
                ->render(fn (Sale $sale) => $sale->user?->name),
            TD::make('published_at', __('Published'))
                ->usingComponent(DateTimeSplit::class)
                ->sort(),
            TD::make('updated_at', __('Updated'))
                ->usingComponent(DateTimeSplit::class)
                ->sort(),
        ];
    }
}

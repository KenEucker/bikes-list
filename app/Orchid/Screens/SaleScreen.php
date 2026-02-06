<?php

namespace App\Orchid\Screens;

use App\Domain\Sales\Sale;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Alert;

class SaleScreen extends Screen
{
    /**
     * Query data.
     *
     * @return array
     */
    public function query(): iterable
    {
        return [
            'sales' => Sale::with(['region', 'user'])
                ->orderBy('created_at', 'desc')
                ->paginate(),
        ];
    }

    /**
     * Display header name.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'For Sale Moderation';
    }

    /**
     * Button commands.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): array
    {
        return [];
    }

    /**
     * Views.
     *
     * @return \Orchid\Screen\Layout[]|string[]
     */
    public function layout(): array
    {
        return [
            Layout::table('sales', [
                \Orchid\Screen\TD::make('id', 'ID'),
                \Orchid\Screen\TD::make('title', 'Title'),
                \Orchid\Screen\TD::make('region.name', 'Region'),
                \Orchid\Screen\TD::make('user.email', 'User'),
                \Orchid\Screen\TD::make('status', 'Status'),
                \Orchid\Screen\TD::make('actions', 'Actions')
                    ->render(fn ($sale) => Button::make('View')
                        ->method('view', ['sale' => $sale->id])),
            ]),
        ];
    }
}

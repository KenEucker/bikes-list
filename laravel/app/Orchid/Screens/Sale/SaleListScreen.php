<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Sale;

use App\Models\Sale;
use App\Orchid\Layouts\Sale\SaleListLayout;
use Orchid\Screen\Screen;

class SaleListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'sales' => Sale::query()
                ->with(['city', 'user'])
                ->orderByDesc('updated_at')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Sales');
    }

    public function description(): ?string
    {
        return __('All items for sale.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.sales'];
    }

    public function layout(): iterable
    {
        return [
            SaleListLayout::class,
        ];
    }
}

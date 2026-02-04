<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Guideline;

use App\Models\Guideline;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Components\Cells\DateTimeSplit;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class GuidelineListLayout extends Table
{
    protected $target = 'guidelines';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('id', __('ID'))->sort()->width('80px'),
            TD::make('name', __('Name'))
                ->sort()
                ->render(fn (Guideline $g) => Link::make($g->name)->route('platform.systems.guidelines.edit', $g)),
            TD::make('scope', __('Scope')),
            TD::make('city_id', __('City'))->render(fn (Guideline $g) => $g->city?->name ?? '—'),
            TD::make('published_at', __('Published'))->usingComponent(DateTimeSplit::class)->sort(),
            TD::make('archived_at', __('Archived'))->usingComponent(DateTimeSplit::class)->render(fn (Guideline $g) => $g->archived_at ? $g->archived_at->toDateString() : '—'),
        ];
    }
}

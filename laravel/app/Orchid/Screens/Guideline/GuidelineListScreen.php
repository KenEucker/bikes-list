<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Guideline;

use App\Models\Guideline;
use App\Orchid\Layouts\Guideline\GuidelineListLayout;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;

class GuidelineListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'guidelines' => Guideline::query()
                ->with('city')
                ->orderByDesc('published_at')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Guidelines');
    }

    public function description(): ?string
    {
        return __('Sitewide and city-specific ride community guidelines. Create new versions to update; archive old ones.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.guidelines'];
    }

    public function commandBar(): iterable
    {
        return [
            Link::make(__('Add guideline'))
                ->icon('bs.plus-circle')
                ->route('platform.systems.guidelines.create'),
        ];
    }

    public function layout(): iterable
    {
        return [
            GuidelineListLayout::class,
        ];
    }
}

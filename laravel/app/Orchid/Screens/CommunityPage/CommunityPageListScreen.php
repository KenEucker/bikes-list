<?php

declare(strict_types=1);

namespace App\Orchid\Screens\CommunityPage;

use App\Models\CommunityPage;
use App\Orchid\Layouts\CommunityPage\CommunityPageListLayout;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;

class CommunityPageListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'communityPages' => CommunityPage::query()
                ->with('city')
                ->orderBy('name')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Community pages');
    }

    public function description(): ?string
    {
        return __('Shops, clubs and recurring event pages.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.community-pages'];
    }

    public function commandBar(): iterable
    {
        return [
            Link::make(__('Add page'))
                ->icon('bs.plus-circle')
                ->route('platform.systems.community-pages.create'),
        ];
    }

    public function layout(): iterable
    {
        return [
            CommunityPageListLayout::class,
        ];
    }
}

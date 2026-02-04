<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\CommunityPage;

use App\Models\CommunityPage;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class CommunityPageListLayout extends Table
{
    protected $target = 'communityPages';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('id', __('ID'))->sort()->width('80px'),
            TD::make('name', __('Name'))
                ->sort()
                ->render(fn (CommunityPage $page) => Link::make($page->name)->route('platform.systems.community-pages.edit', $page)),
            TD::make('type', __('Type')),
            TD::make('city', __('City'))->render(fn (CommunityPage $page) => $page->city?->name),
            TD::make('state', __('State')),
        ];
    }
}

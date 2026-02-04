<?php

declare(strict_types=1);

namespace App\Orchid;

use Orchid\Platform\Dashboard;
use Orchid\Platform\ItemPermission;
use Orchid\Platform\OrchidServiceProvider;
use Orchid\Screen\Actions\Menu;

class PlatformProvider extends OrchidServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @param Dashboard $dashboard
     *
     * @return void
     */
    public function boot(Dashboard $dashboard): void
    {
        parent::boot($dashboard);
    }

    /**
     * Register the application menu.
     *
     * @return Menu[]
     */
    public function menu(): array
    {
        return [
            Menu::make(__('Dashboard'))
                ->icon('bs.speedometer2')
                ->route(config('platform.index')),

            Menu::make(__('Cities'))
                ->icon('bs.geo-alt')
                ->route('platform.systems.cities')
                ->permission('platform.systems.cities'),

            Menu::make(__('Listings'))
                ->icon('bs.list-ul')
                ->route('platform.systems.listings')
                ->permission('platform.systems.listings'),

            Menu::make(__('Events'))
                ->icon('bs.calendar-event')
                ->route('platform.systems.events')
                ->permission('platform.systems.events'),

            Menu::make(__('Flagged listings'))
                ->icon('bs.flag')
                ->route('platform.moderation.flagged')
                ->permission('platform.moderation.flagged'),

            Menu::make(__('Guidelines'))
                ->icon('bs.journal-text')
                ->route('platform.systems.guidelines')
                ->permission('platform.systems.guidelines'),

            Menu::make(__('Community pages'))
                ->icon('bs.people')
                ->route('platform.systems.community-pages')
                ->permission('platform.systems.community-pages'),

            Menu::make(__('Claim requests'))
                ->icon('bs.arrow-right-circle')
                ->route('platform.moderation.claims')
                ->permission('platform.moderation.claims'),

            Menu::make(__('Users'))
                ->icon('bs.people')
                ->route('platform.systems.users')
                ->permission('platform.systems.users')
                ->title(__('Access Controls')),

            Menu::make(__('Roles'))
                ->icon('bs.shield')
                ->route('platform.systems.roles')
                ->permission('platform.systems.roles'),
        ];
    }

    /**
     * Register permissions for the application.
     *
     * @return ItemPermission[]
     */
    public function permissions(): array
    {
        return [
            ItemPermission::group(__('System'))
                ->addPermission('platform.systems.cities', __('Cities'))
                ->addPermission('platform.systems.listings', __('Listings'))
                ->addPermission('platform.systems.events', __('Events'))
                ->addPermission('platform.systems.guidelines', __('Guidelines'))
                ->addPermission('platform.systems.roles', __('Roles'))
                ->addPermission('platform.systems.users', __('Users')),
            ItemPermission::group(__('Moderation'))
                ->addPermission('platform.moderation.flagged', __('Flagged listings'))
                ->addPermission('platform.moderation.claims', __('Claim requests')),
            ItemPermission::group(__('Content'))
                ->addPermission('content.create.listing', __('Create listings'))
                ->addPermission('content.create.event', __('Create events'))
                ->addPermission('content.create.community_page', __('Create community pages')),
        ];
    }
}

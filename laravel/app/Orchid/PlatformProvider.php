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

            Menu::make(__('Moderators'))
                ->icon('bs.people')
                ->route('platform.systems.moderators')
                ->permission('platform.systems.cities'),

            Menu::make(__('Sales'))
                ->icon('bs.list-ul')
                ->route('platform.systems.sales')
                ->permission('platform.systems.sales'),

            Menu::make(__('Rides'))
                ->icon('bs.calendar-event')
                ->route('platform.systems.rides')
                ->permission('platform.systems.rides'),

            Menu::make(__('Flagged sales'))
                ->icon('bs.flag')
                ->route('platform.moderation.flagged')
                ->permission('platform.moderation.flagged'),

            Menu::make(__('Moderation audit'))
                ->icon('bs.journal-text')
                ->route('platform.moderation.audit')
                ->permission('platform.systems.roles'),

            Menu::make(__('Guidelines'))
                ->icon('bs.journal-text')
                ->route('platform.systems.guidelines')
                ->permission('platform.systems.guidelines'),

            Menu::make(__('Ride audiences'))
                ->icon('bs.people')
                ->route('platform.systems.ride-audiences')
                ->permission('platform.systems.ride-audiences'),

            Menu::make(__('Ride tags'))
                ->icon('bs.tags')
                ->route('platform.systems.ride-tags')
                ->permission('platform.systems.ride-tags'),

            Menu::make(__('Community pages'))
                ->icon('bs.people')
                ->route('platform.systems.community-pages')
                ->permission('platform.systems.community-pages'),

            Menu::make(__('Claim requests'))
                ->icon('bs.arrow-right-circle')
                ->route('platform.moderation.claims')
                ->permission('platform.moderation.claims'),

            Menu::make(__('Uploads'))
                ->icon('bs.cloud-upload')
                ->route('platform.uploads.bucket')
                ->permission('platform.systems.uploads'),

            Menu::make(__('Users'))
                ->icon('bs.people')
                ->route('platform.systems.users')
                ->permission('platform.systems.users')
                ->title(__('Access Controls')),

            Menu::make(__('Roles'))
                ->icon('bs.shield')
                ->route('platform.systems.roles')
                ->permission('platform.systems.roles'),

            Menu::make(__('Webhooks'))
                ->icon('bs.link-45deg')
                ->route('platform.systems.webhooks')
                ->permission('platform.systems.webhooks'),
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
                ->addPermission('platform.systems.sales', __('Sales'))
                ->addPermission('platform.systems.rides', __('Rides'))
                ->addPermission('platform.systems.guidelines', __('Guidelines'))
                ->addPermission('platform.systems.ride-audiences', __('Ride audiences'))
                ->addPermission('platform.systems.ride-tags', __('Ride tags'))
                ->addPermission('platform.systems.roles', __('Roles'))
                ->addPermission('platform.systems.users', __('Users'))
                ->addPermission('platform.systems.uploads', __('Uploads'))
                ->addPermission('platform.systems.webhooks', __('Webhooks')),
            ItemPermission::group(__('Moderation'))
                ->addPermission('platform.moderation.flagged', __('Flagged sales'))
                ->addPermission('platform.moderation.claims', __('Claim requests')),
            ItemPermission::group(__('Content'))
                ->addPermission('content.create.sale', __('Create sales'))
                ->addPermission('content.create.ride', __('Create rides'))
                ->addPermission('content.create.community_page', __('Create community pages')),
        ];
    }
}

<?php

namespace App\Orchid;

use Orchid\Platform\Dashboard;
use Orchid\Platform\ItemPermission;
use Orchid\Platform\OrchidServiceProvider as BaseOrchidServiceProvider;

class PlatformProvider extends BaseOrchidServiceProvider
{
    /**
     * @param Dashboard $dashboard
     * @return void
     */
    public function boot(Dashboard $dashboard): void
    {
        parent::boot($dashboard);
        
        // Register your screens, menus, and permissions here
    }

    /**
     * @return array
     */
    public function registerPermissions(): array
    {
        return [
            ItemPermission::group(__('System'))
                ->addPermission('platform.index', __('Main')),
        ];
    }

    /**
     * @return array
     */
    public function registerScreens(): array
    {
        return [
            // Register your screens here
        ];
    }
}

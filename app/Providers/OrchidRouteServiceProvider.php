<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Orchid\Platform\Dashboard;
use Orchid\Platform\Http\Middleware\Access;
use Orchid\Platform\Http\Middleware\BladeIcons;
use Orchid\Platform\Http\Middleware\Turbo;

/**
 * Custom RouteServiceProvider for Orchid compatible with Laravel 12.
 * Replaces Orchid's RouteServiceProvider to avoid Laravel 11 API compatibility issues.
 */
class OrchidRouteServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Register platform middleware group
        Route::middlewareGroup('platform', [
            Turbo::class,
            BladeIcons::class,
            Access::class,
        ]);

        // Register the 'screen' route macro (required by Orchid)
        $this->registerScreenMacro();

        // Register Orchid routes
        $this->map();
    }

    /**
     * Register the 'screen' route macro.
     */
    protected function registerScreenMacro(): void
    {
        if (Route::hasMacro('screen')) {
            return;
        }

        $macro = function (string $url, string $screen) {
            return Route::match(['GET', 'HEAD', 'POST'], $url.'/{method?}', $screen)
                ->where('method', $screen::getAvailableMethods()->implode('|'));
        };

        Route::macro('screen', $macro);
    }

    /**
     * Define the routes for the application.
     */
    protected function map(): void
    {
        $domain = (string) config('platform.domain', '');
        $prefix = Dashboard::prefix('/');

        // For local dev on port 8080, skip domain routing
        $useDomain = $domain && $domain !== 'localhost' && $domain !== '127.0.0.1' && !str_contains($domain, 'localhost');

        // Dashboard routes
        $dashboardRoute = Route::as('platform.');
        if ($prefix) {
            $dashboardRoute = $dashboardRoute->prefix($prefix);
        }
        if ($useDomain) {
            $dashboardRoute = $dashboardRoute->domain($domain);
        }
        $dashboardRoute->middleware(config('platform.middleware.private', []))
            ->group(Dashboard::path('routes/dashboard.php'));

        // Auth routes
        $authRoute = Route::as('platform.');
        if ($prefix) {
            $authRoute = $authRoute->prefix($prefix);
        }
        if ($useDomain) {
            $authRoute = $authRoute->domain($domain);
        }
        $authRoute->middleware(config('platform.middleware.public', []))
            ->group(Dashboard::path('routes/auth.php'));
    }
}

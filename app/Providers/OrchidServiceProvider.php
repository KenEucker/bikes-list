<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Orchid\Platform\Dashboard;
use Orchid\Platform\Providers\FoundationServiceProvider;

class OrchidServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        if (env('APP_RUNTIME') !== 'admin') {
            return;
        }
        
        // Register Orchid's FoundationServiceProvider but override RouteServiceProvider
        $foundationProvider = new FoundationServiceProvider($this->app);
        
        // Get the list of providers to register
        $providers = $foundationProvider->provides();
        
        // Register all providers except RouteServiceProvider
        foreach ($providers as $provider) {
            if ($provider !== \Orchid\Platform\Providers\RouteServiceProvider::class) {
                $this->app->register($provider);
            }
        }
        
        // Register our custom RouteServiceProvider instead of Orchid's
        $this->app->register(OrchidRouteServiceProvider::class);
        
        // Register Dashboard singleton
        $this->app->singleton(Dashboard::class, static fn () => new Dashboard);
        
        // Register PlatformProvider (custom Orchid provider)
        $this->app->register(\App\Orchid\PlatformProvider::class);
        
        // Load platform config
        $dashboard = app(Dashboard::class);
        $configPath = $dashboard->path('config/platform.php');
        if (file_exists($configPath)) {
            $this->app['config']->set('platform', require $configPath);
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        if (env('APP_RUNTIME') !== 'admin') {
            return;
        }
        
        // Load Orchid views and translations
        $dashboard = app(Dashboard::class);
        $this->loadViewsFrom($dashboard->path('resources/views'), 'platform');
        $this->loadJsonTranslationsFrom($dashboard->path('resources/lang/'));
    }
}

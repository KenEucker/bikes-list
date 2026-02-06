<?php

namespace App\Providers;

use App\Domain\Regions\CurrentRegion;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register CurrentRegion as singleton
        $this->app->singleton(CurrentRegion::class, function () {
            return new CurrentRegion();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register policies
        // Gate::policy(Sale::class, SalePolicy::class);
        
        // Configure API rate limiting
        \Illuminate\Support\Facades\RateLimiter::for('api', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Force Vite to use APP_URL instead of request Host (fixes localhost development)
        if (app()->environment('local')) {
            \Illuminate\Support\Facades\URL::forceRootUrl(config('app.url'));
        }
    }
}

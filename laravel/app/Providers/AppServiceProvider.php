<?php

namespace App\Providers;

use App\Models\CommunityPage;
use App\Policies\CommunityPagePolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        RateLimiter::for('uploads', function (Request $request) {
            return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
        });

        Gate::policy(CommunityPage::class, CommunityPagePolicy::class);

        // Force session cookie domain in local so login works on main site and all *.localhost subdomains
        if (! $this->app->runningInConsole() && Config::get('app.env') === 'local') {
            Config::set('session.domain', '.localhost');
            Config::set('session.driver', 'database');
        }
    }
}

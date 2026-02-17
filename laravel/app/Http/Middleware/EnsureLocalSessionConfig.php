<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

/**
 * Force session driver and cookie domain in local so that:
 * - Sessions persist in DB across server restarts
 * - Login on main site is valid on all subdomains (when APP_DOMAIN is set)
 *
 * Browsers do NOT reliably share cookies for Domain=.localhost with *.localhost.
 * Set APP_DOMAIN=e.g. bikeslist.test and use that domain in hosts + APP_URL.
 *
 * Must run before StartSession, so we prepend to the web group.
 */
class EnsureLocalSessionConfig
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Config::get('app.env') === 'local') {
            Config::set('session.driver', 'database');
            $domain = $this->sessionCookieDomain($request);
            Config::set('session.domain', $domain);
        }

        return $next($request);
    }

    private function sessionCookieDomain(Request $request): ?string
    {
        $host = $request->getHost();
        $appDomain = config('app.domain');
        if ($appDomain && $appDomain !== 'localhost') {
            if ($host === $appDomain || str_ends_with($host, '.' . $appDomain)) {
                return '.' . $appDomain;
            }
        }
        if ($host === 'localhost' || str_ends_with($host, '.localhost')) {
            return '.localhost';
        }
        return null;
    }
}

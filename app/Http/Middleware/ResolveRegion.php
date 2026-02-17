<?php

namespace App\Http\Middleware;

use App\Domain\Regions\CurrentRegion;
use App\Domain\Regions\Region;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveRegion
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        
        // Skip region resolution for bikeslist.org (landing page)
        if ($host === 'bikeslist.org' || $host === 'localhost') {
            return $next($request);
        }

        // Skip for admin subdomain
        if ($host === 'admin.bikeslist.org') {
            return $next($request);
        }

        // Extract subdomain from *.bikeslist.org
        $subdomain = $this->extractSubdomain($host);
        
        if ($subdomain) {
            $region = Region::where('slug', $subdomain)
                ->isActive()
                ->first();

            if (!$region) {
                abort(404, 'Region not found');
            }

            // Set current region in service container
            app(CurrentRegion::class)->set($region);
        }

        return $next($request);
    }

    /**
     * Extract subdomain from host.
     */
    protected function extractSubdomain(string $host): ?string
    {
        // Handle *.bikeslist.org pattern
        if (preg_match('/^([^.]+)\.bikeslist\.org$/', $host, $matches)) {
            return $matches[1];
        }

        // Handle local development with /etc/hosts entries like sf.bikeslist.org
        if (preg_match('/^([^.]+)\.bikeslist\.local$/', $host, $matches)) {
            return $matches[1];
        }

        return null;
    }
}

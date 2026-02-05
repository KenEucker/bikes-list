<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

abstract class Controller
{
    /**
     * Build the base URL for a city subdomain (e.g. http://dubai.bikeslist.test or http://dubai.localhost).
     * Uses the app URL host as-is (e.g. bikeslist.test) so city URLs are citySlug.bikeslist.test.
     * If no app.url host, derives base from request host by stripping the first segment (e.g. dubai.bikeslist.test -> bikeslist.test).
     */
    protected static function cityBaseUrl(Request $request, string $citySlug): string
    {
        $requestHost = $request->getHost();
        // Keep the user on the same domain they're using (e.g. portland.bikeslist.test).
        if (str_starts_with($requestHost, $citySlug . '.')) {
            $scheme = $request->getScheme();
            $port = $request->getPort() && ! in_array($request->getPort(), [80, 443]) ? ':' . $request->getPort() : '';
            return $scheme . '://' . $requestHost . $port;
        }
        $appHost = parse_url(config('app.url'), PHP_URL_HOST);
        if ($appHost) {
            $baseHost = $appHost;
        } else {
            $baseHost = $requestHost;
            if (str_contains($requestHost, '.')) {
                $parts = explode('.', $requestHost, 2);
                $baseHost = $parts[1];
            }
        }
        $scheme = $request->getScheme();
        $port = $request->getPort() && ! in_array($request->getPort(), [80, 443]) ? ':' . $request->getPort() : '';

        return $scheme . '://' . $citySlug . '.' . $baseHost . $port;
    }
}

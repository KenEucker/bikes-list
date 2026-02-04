<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;

/**
 * Force session and XSRF cookies to a shared domain so login on the main site
 * is valid on all subdomains. Uses APP_DOMAIN when set (e.g. bikeslist.test);
 * otherwise .localhost (which many browsers do not share with *.localhost).
 * Runs after the response is created.
 */
class ForceSessionCookieDomain
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! app()->environment('local')) {
            return $response;
        }

        $domain = $this->cookieDomain($request);
        if ($domain === null) {
            return $response;
        }

        $sessionName = config('session.cookie');
        $cookies = $response->headers->getCookies();

        foreach ($cookies as $cookie) {
            $name = $cookie->getName();
            if ($name !== $sessionName && $name !== 'XSRF-TOKEN') {
                continue;
            }
            $response->headers->removeCookie($name, $cookie->getPath() ?: '/', $cookie->getDomain());
            $response->headers->setCookie(new Cookie(
                $name,
                $cookie->getValue(),
                $cookie->getExpiresTime(),
                $cookie->getPath() ?: '/',
                $domain, // .bikeslist.test or .localhost
                $cookie->isSecure(),
                $cookie->isHttpOnly(),
                $cookie->isRaw(),
                $cookie->getSameSite(),
                $cookie->isPartitioned()
            ));
        }

        return $response;
    }

    private function cookieDomain(Request $request): ?string
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

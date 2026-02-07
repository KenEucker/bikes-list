<?php

namespace App\Http\Middleware;

use App\Models\City;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $base = $request->getSchemeAndHttpHost();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'csrf_token' => csrf_token(),
            'seo' => [
                'defaultDescription' => 'BikesList – local bike sales, rides, and community by city.',
                'defaultOgImage' => asset('bikeslist.png'),
                'canonicalBase' => $base,
                'currentUrl' => $request->url(),
            ],
            'urls' => [
                'base' => $base,
                'dashboard' => $base . '/dashboard',
                'accountSettings' => $base . '/account/settings',
                'accountSettingsUpdate' => $base . '/account/settings',
                'accountSettingsDestroy' => $base . '/account/settings',
                'signIn' => $base . '/account/sign-in',
                'signUp' => $base . '/account/sign-up',
                'logout' => $base . '/logout',
                'passwordUpdate' => $base . '/password',
                'passwordRequest' => $base . '/forgot-password',
                'verificationSend' => $base . '/email/verification-notification',
                'savedSearches' => $base . '/account/saved-searches',
                'home' => $base . '/',
                'mainSite' => rtrim(config('app.url'), '/') . '/',
                'terms' => $base . '/terms',
                'privacy' => $base . '/privacy',
            ],
            'dashboardUrl' => $base . '/dashboard',
            'logo' => asset('bikeslist.png'),
            'appName' => config('app.name'),
            'flash' => [
                'status' => fn () => $request->session()->get('status'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'status' => fn () => $request->session()->get('status'),
            'canAccessModeration' => fn () => $this->resolveCanAccessModeration($request),
            'moderationUrl' => fn () => $this->resolveModerationUrl($request),
        ];
    }

    private function resolveCanAccessModeration(Request $request): bool
    {
        $user = $request->user();
        $citySlug = $this->resolveCitySlug($request);
        if (! $user || ! $citySlug) {
            return false;
        }
        $city = City::query()->where('slug', $citySlug)->first();

        return $city && $user->canModerateCity($city);
    }

    private function resolveModerationUrl(Request $request): ?string
    {
        if (! $this->resolveCanAccessModeration($request)) {
            return null;
        }
        $base = $request->getSchemeAndHttpHost();

        return $base . '/moderation';
    }

    /** Derive city slug from route or from host (e.g. london.localhost -> london). */
    private function resolveCitySlug(Request $request): ?string
    {
        $citySlug = $request->route('city');
        if ($citySlug !== null && $citySlug !== '') {
            return $citySlug;
        }
        $host = $request->getHost();
        if (str_contains($host, '.')) {
            return explode('.', $host)[0];
        }

        return null;
    }
}

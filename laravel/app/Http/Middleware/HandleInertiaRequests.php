<?php

namespace App\Http\Middleware;

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
        ];
    }
}

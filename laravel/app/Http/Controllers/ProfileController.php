<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\City;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     * When on a city subdomain, pass city + cityBaseUrl so the page uses CityLayout and matches the rest of the frontend.
     */
    public function edit(Request $request): Response
    {
        $citySlug = $this->resolveCitySlugFromHost($request);
        $city = $citySlug ? City::query()->where('slug', $citySlug)->first() : null;
        $cityBaseUrl = $city ? self::cityBaseUrl($request, $city->slug) : null;

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'city' => $city,
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    private function resolveCitySlugFromHost(Request $request): ?string
    {
        $host = $request->getHost();
        if (! str_contains($host, '.')) {
            return null;
        }

        return explode('.', $host)[0];
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('account.settings');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}

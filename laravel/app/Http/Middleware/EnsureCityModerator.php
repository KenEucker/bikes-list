<?php

namespace App\Http\Middleware;

use App\Models\City;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCityModerator
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user) {
            return redirect()->route('account.sign-in');
        }

        $citySlug = $request->route('city');
        if (! $citySlug) {
            abort(404);
        }

        $city = City::query()->where('slug', $citySlug)->first();
        if (! $city || ! $user->canModerateCity($city)) {
            abort(403, 'Not authorized to moderate this city.');
        }

        return $next($request);
    }
}

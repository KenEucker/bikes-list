<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CommunityPage;
use App\Models\Event;
use App\Models\Listing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ModerationController extends Controller
{
    public function index(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);
        $moderatedCities = $request->user()->moderatedCities()->orderBy('name')->get();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Moderation/Index', [
            'city' => $city,
            'moderatedCities' => $moderatedCities,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
        ]);
    }

    public function listings(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);

        $listings = Listing::query()
            ->where('city_id', $city->id)
            ->where('state', Listing::STATE_PENDING_REVIEW)
            ->with(['user:id,name', 'communityPage:id,name,slug'])
            ->orderBy('updated_at')
            ->paginate(20)
            ->withQueryString();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Moderation/Listings', [
            'city' => $city,
            'listings' => $listings,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
        ]);
    }

    public function events(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);

        $events = Event::query()
            ->where('city_id', $city->id)
            ->where('state', Event::STATE_PENDING_REVIEW)
            ->with(['user:id,name', 'communityPage:id,name,slug'])
            ->orderBy('starts_at')
            ->paginate(20)
            ->withQueryString();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Moderation/Events', [
            'city' => $city,
            'events' => $events,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
        ]);
    }

    public function pages(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);

        $pages = CommunityPage::query()
            ->where('city_id', $city->id)
            ->where('state', CommunityPage::STATE_PENDING)
            ->with('createdByUser:id,name')
            ->orderBy('updated_at')
            ->paginate(20)
            ->withQueryString();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Moderation/Pages', [
            'city' => $city,
            'pages' => $pages,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
        ]);
    }

    private function authorizeModerator($user, City $city): void
    {
        if (! $user || ! $user->moderatedCities()->where('cities.id', $city->id)->exists()) {
            abort(403, 'Not authorized to moderate this city.');
        }
    }
}

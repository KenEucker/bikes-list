<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CommunityPage;
use App\Models\Ride;
use App\Models\Sale;
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

    public function sales(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);

        $sales = Sale::query()
            ->where('city_id', $city->id)
            ->where('state', Sale::STATE_PENDING_REVIEW)
            ->with(['user:id,name', 'communityPage:id,name,slug'])
            ->orderBy('updated_at')
            ->paginate(20)
            ->withQueryString();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Moderation/Sales', [
            'city' => $city,
            'sales' => $sales,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
        ]);
    }

    public function rides(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);

        $rides = Ride::query()
            ->where('city_id', $city->id)
            ->where('state', Ride::STATE_PENDING_REVIEW)
            ->with(['user:id,name', 'communityPage:id,name,slug'])
            ->orderBy('starts_at')
            ->paginate(20)
            ->withQueryString();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Moderation/Rides', [
            'city' => $city,
            'rides' => $rides,
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

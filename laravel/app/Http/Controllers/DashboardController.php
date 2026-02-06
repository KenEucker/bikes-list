<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CommunityPage;
use App\Models\Ride;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $user = $request->user();

        $mySalesCount = Sale::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->count();
        $myRidesCount = Ride::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->count();
        $pendingSalesCount = Sale::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->where('state', Sale::STATE_PENDING_REVIEW)
            ->count();
        $pendingRidesCount = Ride::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->where('state', Ride::STATE_PENDING_REVIEW)
            ->count();
        $managedPagesCount = $user->managedCommunityPages()->where('community_pages.city_id', $city->id)->count();
        $pendingPagesCount = $user->managedCommunityPages()
            ->where('community_pages.city_id', $city->id)
            ->where('community_pages.state', CommunityPage::STATE_PENDING)
            ->count();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Dashboard/Index', [
            'city' => $city,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
            'counts' => [
                'sales' => $mySalesCount,
                'rides' => $myRidesCount,
                'pendingSales' => $pendingSalesCount,
                'pendingRides' => $pendingRidesCount,
                'pages' => $managedPagesCount,
                'pendingPages' => $pendingPagesCount,
            ],
        ]);
    }

    public function sales(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $user = $request->user();

        $sales = Sale::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->with('communityPage:id,name,slug')
            ->orderBy('updated_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Dashboard/Sales', [
            'city' => $city,
            'sales' => $sales,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
        ]);
    }

    public function rides(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $user = $request->user();

        $rides = Ride::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->with('communityPage:id,name,slug')
            ->orderBy('starts_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Dashboard/Rides', [
            'city' => $city,
            'rides' => $rides,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
        ]);
    }

    public function pending(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $user = $request->user();

        $sales = Sale::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->where('state', Sale::STATE_PENDING_REVIEW)
            ->orderBy('updated_at', 'desc')
            ->get();
        $rides = Ride::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->where('state', Ride::STATE_PENDING_REVIEW)
            ->orderBy('starts_at')
            ->get();
        $pages = $user->managedCommunityPages()
            ->where('community_pages.city_id', $city->id)
            ->where('community_pages.state', CommunityPage::STATE_PENDING)
            ->orderBy('community_pages.updated_at', 'desc')
            ->get();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Dashboard/Pending', [
            'city' => $city,
            'sales' => $sales,
            'rides' => $rides,
            'pages' => $pages,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
        ]);
    }

    public function pages(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $user = $request->user();

        $pages = $user->managedCommunityPages()
            ->where('community_pages.city_id', $city->id)
            ->orderBy('community_pages.name')
            ->get();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Dashboard/Pages', [
            'city' => $city,
            'pages' => $pages,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
        ]);
    }

    public function pageShow(Request $request, string $citySlug, string $slug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $page = CommunityPage::query()->where('city_id', $city->id)->where('slug', $slug)->firstOrFail();
        if (! $request->user()->managedCommunityPages()->where('community_pages.id', $page->id)->exists()) {
            abort(403);
        }

        $page->load(['sales' => fn ($q) => $q->orderBy('updated_at', 'desc'), 'rides' => fn ($q) => $q->orderBy('starts_at', 'desc')]);

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Dashboard/PageShow', [
            'city' => $city,
            'page' => $page,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
        ]);
    }
}

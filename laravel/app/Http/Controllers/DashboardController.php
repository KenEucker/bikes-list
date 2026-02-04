<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CommunityPage;
use App\Models\Event;
use App\Models\Listing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $user = $request->user();

        $myListingsCount = Listing::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->count();
        $myEventsCount = Event::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->count();
        $pendingListingsCount = Listing::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->where('state', Listing::STATE_PENDING_REVIEW)
            ->count();
        $pendingEventsCount = Event::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->where('state', Event::STATE_PENDING_REVIEW)
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
                'listings' => $myListingsCount,
                'events' => $myEventsCount,
                'pendingListings' => $pendingListingsCount,
                'pendingEvents' => $pendingEventsCount,
                'pages' => $managedPagesCount,
                'pendingPages' => $pendingPagesCount,
            ],
        ]);
    }

    public function listings(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $user = $request->user();

        $listings = Listing::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->with('communityPage:id,name,slug')
            ->orderBy('updated_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Dashboard/Listings', [
            'city' => $city,
            'listings' => $listings,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
        ]);
    }

    public function events(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $user = $request->user();

        $events = Event::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->with('communityPage:id,name,slug')
            ->orderBy('starts_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Dashboard/Events', [
            'city' => $city,
            'events' => $events,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
        ]);
    }

    public function pending(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $user = $request->user();

        $listings = Listing::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->where('state', Listing::STATE_PENDING_REVIEW)
            ->orderBy('updated_at', 'desc')
            ->get();
        $events = Event::query()
            ->where('city_id', $city->id)
            ->where('user_id', $user->id)
            ->where('state', Event::STATE_PENDING_REVIEW)
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
            'listings' => $listings,
            'events' => $events,
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

        $page->load(['listings' => fn ($q) => $q->orderBy('updated_at', 'desc'), 'events' => fn ($q) => $q->orderBy('starts_at', 'desc')]);

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Dashboard/PageShow', [
            'city' => $city,
            'page' => $page,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CommunityPage;
use App\Models\Event;
use App\Models\Listing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function index(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $q = $request->input('q', '');
        $tab = $request->input('tab', 'listings');

        $listings = collect();
        $events = collect();
        $pages = collect();

        if (strlen($q) >= 2) {
            $listings = Listing::query()
                ->where('city_id', $city->id)
                ->whereIn('state', [Listing::STATE_PUBLISHED, Listing::STATE_SOLD])
                ->where(function ($query) use ($q) {
                    $query->where('title', 'ilike', '%' . $q . '%')
                        ->orWhere('description', 'ilike', '%' . $q . '%');
                })
                ->orderBy('published_at', 'desc')
                ->limit(20)
                ->get();

            $events = Event::query()
                ->where('city_id', $city->id)
                ->where('state', Event::STATE_PUBLISHED)
                ->where(function ($query) use ($q) {
                    $query->where('title', 'ilike', '%' . $q . '%')
                        ->orWhere('description', 'ilike', '%' . $q . '%');
                })
                ->where('ends_at', '>=', now())
                ->orderBy('starts_at')
                ->limit(20)
                ->get();

            $pages = CommunityPage::query()
                ->where('city_id', $city->id)
                ->where('state', CommunityPage::STATE_APPROVED)
                ->where(function ($query) use ($q) {
                    $query->where('name', 'ilike', '%' . $q . '%')
                        ->orWhere('about', 'ilike', '%' . $q . '%');
                })
                ->orderBy('name')
                ->limit(20)
                ->get();
        }

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Search/Index', [
            'city' => $city,
            'query' => $q,
            'tab' => $tab,
            'listings' => $listings,
            'events' => $events,
            'pages' => $pages,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }
}

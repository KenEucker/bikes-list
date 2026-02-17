<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CommunityPage;
use App\Models\Ride;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function index(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $q = $request->input('q', '');
        $tab = $request->input('tab', 'sales');

        $sales = collect();
        $rides = collect();
        $pages = collect();

        if (strlen($q) >= 2) {
            $sales = Sale::query()
                ->where('city_id', $city->id)
                ->whereIn('state', [Sale::STATE_PUBLISHED, Sale::STATE_SOLD])
                ->where(function ($query) use ($q) {
                    $query->where('title', 'ilike', '%' . $q . '%')
                        ->orWhere('description', 'ilike', '%' . $q . '%');
                })
                ->orderBy('published_at', 'desc')
                ->limit(20)
                ->get();

            $rides = Ride::query()
                ->where('city_id', $city->id)
                ->where('state', Ride::STATE_PUBLISHED)
                ->where(function ($query) use ($q) {
                    $query->where('name', 'ilike', '%' . $q . '%')
                        ->orWhere('description', 'ilike', '%' . $q . '%');
                })
                ->where(function ($query) {
                    $query->whereNull('ends_at')->orWhere('ends_at', '>=', now());
                })
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
            'sales' => $sales,
            'rides' => $rides,
            'pages' => $pages,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }
}

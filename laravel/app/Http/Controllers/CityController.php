<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CityController extends Controller
{
    public function index(): Response
    {
        $cities = City::query()->orderBy('country')->orderBy('state_province')->orderBy('name')->get();

        $grouped = $cities->groupBy(function ($city) {
            $country = $city->country ?: 'Other';
            $state = $city->state_province ?: '';
            return $country . '|' . $state;
        })->map(function ($group) {
            $first = $group->first();
            return [
                'country' => $first->country ?: 'Other',
                'state_province' => $first->state_province,
                'cities' => $group->values()->all(),
            ];
        })->values()->all();

        return Inertia::render('Home', [
            'cities' => $cities,
            'grouped' => $grouped,
        ]);
    }

    public function show(Request $request, string $city): Response
    {
        $cityModel = City::query()->where('slug', $city)->firstOrFail();
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();
        $upcomingEvents = Event::query()
            ->where('city_id', $cityModel->id)
            ->where('state', Event::STATE_PUBLISHED)
            ->where('ends_at', '>=', now())
            ->where('starts_at', '<=', $endOfMonth)
            ->orderBy('starts_at')
            ->get();
        $featuredPages = \App\Models\CommunityPage::query()
            ->where('city_id', $cityModel->id)
            ->where('state', \App\Models\CommunityPage::STATE_APPROVED)
            ->where('featured', true)
            ->orderBy('name')
            ->limit(3)
            ->get();
        if ($featuredPages->count() < 3) {
            $extra = \App\Models\CommunityPage::query()
                ->where('city_id', $cityModel->id)
                ->where('state', \App\Models\CommunityPage::STATE_APPROVED)
                ->whereNotIn('id', $featuredPages->pluck('id'))
                ->orderBy('created_at')
                ->limit(3 - $featuredPages->count())
                ->get();
            $featuredPages = $featuredPages->merge($extra);
        }
        $listingsPreview = \App\Models\Listing::query()
            ->where('city_id', $cityModel->id)
            ->whereIn('state', [\App\Models\Listing::STATE_PUBLISHED, \App\Models\Listing::STATE_SOLD])
            ->with(['relayAddress', 'attachments'])
            ->latest('published_at')
            ->limit(20)
            ->get();
        $cityBaseUrl = self::cityBaseUrl($request, $city);

        $upcomingEventsWithUrl = $upcomingEvents->map(fn ($e) => array_merge($e->toArray(), [
            'url' => $cityBaseUrl . '/events/' . $e->id,
        ]))->values()->all();

        $payload = [
            'city' => $cityModel->only(['id', 'name', 'slug', 'description', 'latitude', 'longitude', 'state_province', 'country']),
            'homeUrl' => (string) config('app.url'),
            'upcomingEvents' => array_values($upcomingEventsWithUrl),
            'featuredPages' => array_values($featuredPages->values()->all()),
            'listingsPreview' => array_values($listingsPreview->values()->all()),
            'cityBaseUrl' => (string) $cityBaseUrl,
        ];
        return Inertia::render('City/Show', $payload);
    }
}

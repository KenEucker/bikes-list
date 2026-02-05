<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CityController extends Controller
{
    public function index(Request $request): Response
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

        $preferredCountryCode = $this->preferredCountryFromRequest($request);
        if ($preferredCountryCode !== null) {
            $grouped = $this->sortGroupedWithCountryFirst($grouped, $preferredCountryCode);
        }

        return Inertia::render('Home', [
            'cities' => $cities,
            'grouped' => $grouped,
        ]);
    }

    /**
     * Parse Accept-Language to get the user's likely country/region code (e.g. "en-GB" → "GB").
     */
    private function preferredCountryFromRequest(Request $request): ?string
    {
        $header = $request->header('Accept-Language', '');
        $first = trim(explode(',', $header)[0] ?? '');
        if ($first === '') {
            return null;
        }
        $parts = explode('-', $first);
        if (count($parts) < 2 || strlen($parts[1]) !== 2) {
            return null;
        }
        return strtoupper($parts[1]);
    }

    /**
     * Sort grouped cities so the given country code's groups appear first (rest keep relative order).
     *
     * @param array<int, array{country: string, state_province: ?string, cities: array}> $grouped
     * @return array<int, array{country: string, state_province: ?string, cities: array}>
     */
    private function sortGroupedWithCountryFirst(array $grouped, string $countryCode): array
    {
        $matching = [];
        $other = [];
        foreach ($grouped as $g) {
            $code = $g['country'] ?? '';
            if (strtoupper((string) $code) === $countryCode) {
                $matching[] = $g;
            } else {
                $other[] = $g;
            }
        }
        return array_merge($matching, $other);
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

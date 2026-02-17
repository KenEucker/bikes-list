<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CommunityPage;
use App\Models\CommunityPageClaim;
use App\Models\Flag;
use App\Models\ModerationAction;
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
        $moderatedCities = $request->user()->isGlobalModerator()
            ? City::query()->orderBy('name')->get()
            : $request->user()->moderatedCities()->orderBy('name')->get();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        $newItems = self::newItemsForCity($city, $cityBaseUrl);

        return Inertia::render('Moderation/Index', [
            'city' => $city,
            'moderatedCities' => $moderatedCities,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
            'reasonCodes' => ModerationAction::reasonCodes(),
            'newItems' => $newItems,
        ]);
    }

    private static function newItemsForCity(City $city, string $cityBaseUrl): array
    {
        $since = now()->subWeek();
        $items = [];
        Sale::query()
            ->where('city_id', $city->id)
            ->where('created_at', '>=', $since)
            ->orderByDesc('created_at')
            ->get(['id', 'title', 'state', 'created_at'])
            ->each(function (Sale $s) use ($cityBaseUrl, &$items) {
                $items[] = [
                    'type' => 'sale',
                    'id' => $s->id,
                    'title' => $s->title,
                    'state' => $s->state,
                    'created_at' => $s->created_at->toIso8601String(),
                    'url' => $cityBaseUrl . '/for-sale/' . $s->id,
                    'queue_url' => $cityBaseUrl . '/moderation/sales',
                ];
            });
        Ride::query()
            ->where('city_id', $city->id)
            ->where('created_at', '>=', $since)
            ->orderByDesc('created_at')
            ->get(['id', 'name', 'state', 'created_at'])
            ->each(function (Ride $r) use ($cityBaseUrl, &$items) {
                $items[] = [
                    'type' => 'ride',
                    'id' => $r->id,
                    'title' => $r->name,
                    'state' => $r->state,
                    'created_at' => $r->created_at->toIso8601String(),
                    'url' => $cityBaseUrl . '/rides/' . $r->id,
                    'queue_url' => $cityBaseUrl . '/moderation/rides',
                ];
            });
        CommunityPage::query()
            ->where('city_id', $city->id)
            ->where('created_at', '>=', $since)
            ->orderByDesc('created_at')
            ->get(['id', 'name', 'slug', 'state', 'created_at'])
            ->each(function (CommunityPage $p) use ($cityBaseUrl, &$items) {
                $items[] = [
                    'type' => 'page',
                    'id' => $p->id,
                    'title' => $p->name,
                    'state' => $p->state,
                    'created_at' => $p->created_at->toIso8601String(),
                    'url' => $cityBaseUrl . '/community/' . $p->slug,
                    'queue_url' => $cityBaseUrl . '/moderation/pages',
                ];
            });
        usort($items, fn ($a, $b) => strcmp($b['created_at'], $a['created_at']));

        return array_slice($items, 0, 50);
    }

    public function sales(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);

        $pendingSales = Sale::query()
            ->where('city_id', $city->id)
            ->where('state', Sale::STATE_PENDING_REVIEW)
            ->with(['user:id,name', 'communityPage:id,name,slug'])
            ->orderBy('updated_at')
            ->paginate(20, ['*'], 'pending_page')
            ->withQueryString();

        $flaggedSaleIds = Flag::query()
            ->where('flaggable_type', Sale::class)
            ->whereIn('flaggable_id', Sale::query()->where('city_id', $city->id)->pluck('id'))
            ->select('flaggable_id')
            ->distinct()
            ->pluck('flaggable_id');
        $flaggedSales = Sale::query()
            ->where('city_id', $city->id)
            ->whereIn('id', $flaggedSaleIds)
            ->where('state', '!=', Sale::STATE_REMOVED)
            ->with(['user:id,name', 'communityPage:id,name,slug'])
            ->withCount('flags')
            ->orderByDesc('updated_at')
            ->paginate(20, ['*'], 'flagged_page')
            ->withQueryString();

        $publishedSales = Sale::query()
            ->where('city_id', $city->id)
            ->where('state', Sale::STATE_PUBLISHED)
            ->with(['user:id,name', 'communityPage:id,name,slug'])
            ->orderByDesc('published_at')
            ->paginate(20, ['*'], 'published_page')
            ->withQueryString();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Moderation/Sales', [
            'city' => $city,
            'pendingSales' => $pendingSales,
            'flaggedSales' => $flaggedSales,
            'publishedSales' => $publishedSales,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
            'reasonCodes' => ModerationAction::reasonCodes(),
        ]);
    }

    public function rides(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);

        $pendingRides = Ride::query()
            ->where('city_id', $city->id)
            ->where('state', Ride::STATE_PENDING_REVIEW)
            ->with(['user:id,name', 'communityPage:id,name,slug'])
            ->orderBy('starts_at')
            ->paginate(20, ['*'], 'pending_page')
            ->withQueryString();

        $publishedRides = Ride::query()
            ->where('city_id', $city->id)
            ->where('state', Ride::STATE_PUBLISHED)
            ->with(['user:id,name', 'communityPage:id,name,slug'])
            ->orderBy('starts_at')
            ->paginate(20, ['*'], 'published_page')
            ->withQueryString();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Moderation/Rides', [
            'city' => $city,
            'pendingRides' => $pendingRides,
            'publishedRides' => $publishedRides,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
            'reasonCodes' => ModerationAction::reasonCodes(),
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
            'reasonCodes' => ModerationAction::reasonCodes(),
        ]);
    }

    public function claims(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);

        $claims = CommunityPageClaim::query()
            ->where('status', CommunityPageClaim::STATUS_PENDING)
            ->whereHas('communityPage', fn ($q) => $q->where('city_id', $city->id))
            ->with(['communityPage:id,name,slug', 'user:id,name'])
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('Moderation/Claims', [
            'city' => $city,
            'claims' => $claims,
            'cityBaseUrl' => $cityBaseUrl,
            'homeUrl' => config('app.url'),
            'reasonCodes' => ModerationAction::reasonCodes(),
        ]);
    }

    private function authorizeModerator($user, City $city): void
    {
        if (! $user || ! $user->canModerateCity($city)) {
            abort(403, 'Not authorized to moderate this city.');
        }
    }
}

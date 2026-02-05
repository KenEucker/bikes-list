<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CommunityPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CommunityPageController extends Controller
{
    public function index(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $pages = CommunityPage::query()
            ->where('city_id', $city->id)
            ->where('state', CommunityPage::STATE_APPROVED)
            ->orderBy('name')
            ->paginate(20);

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return Inertia::render('CommunityPages/Index', [
            'city' => $city,
            'pages' => $pages,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function show(string $citySlug, string $slug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $communityPage = CommunityPage::query()->where('city_id', $city->id)->where('slug', $slug)->firstOrFail();
        Gate::authorize('view', $communityPage);
        $communityPage->load(['city', 'managers', 'listings' => fn ($q) => $q->where('state', 'published')->limit(10), 'events' => fn ($q) => $q->where('state', 'published')->where('ends_at', '>=', now())->orderBy('starts_at')->limit(10)]);

        $cityBaseUrl = self::cityBaseUrl(request(), $citySlug);

        return Inertia::render('CommunityPages/Show', [
            'city' => $city,
            'communityPage' => $communityPage,
            'moderatorRelayEmail' => 'report-page-' . $communityPage->slug . '@' . (parse_url($cityBaseUrl, PHP_URL_HOST) ?? parse_url(config('app.url'), PHP_URL_HOST)),
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function create(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if (! $request->user()) {
            abort(403, 'You must be signed in to add a community page.');
        }

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        $errors = $request->session()->get('errors');
        $errorBag = $errors && $errors->hasBag('default') ? $errors->getBag('default')->toArray() : [];

        return Inertia::render('CommunityPages/Create', [
            'city' => $city,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
            'errors' => $errorBag,
            'old' => $request->old(),
        ]);
    }

    public function store(Request $request, string $citySlug): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if (! $request->user()) {
            abort(403, 'You must be signed in to add a community page.');
        }
        $request->validate([
            'type' => ['required', 'in:bike_shop,club,recurring_event'],
            'name' => ['required', 'string', 'max:255'],
            'about' => ['nullable', 'string'],
            'event_info' => ['nullable', 'string'],
            'sales_info' => ['nullable', 'string'],
            'contact_address' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
        ]);
        $data = $request->only(['type', 'name', 'about', 'event_info', 'sales_info', 'contact_address', 'contact_email', 'contact_phone']);
        $data['city_id'] = $city->id;
        $data['created_by_user_id'] = $request->user()->id;
        $data['state'] = CommunityPage::STATE_PENDING;
        $data['slug'] = Str::slug($data['name']) . '-' . uniqid();
        $page = CommunityPage::create($data);
        $page->update(['slug' => Str::slug($page->name) . '-' . $page->id]);
        $page->managers()->attach($request->user()->id, ['role' => 'owner']);
        return redirect()->route('city.community-pages.show', [$citySlug, $page->slug])->with('status', 'Page submitted for review. It will be approved automatically if not reviewed by a moderator.');
    }

    public function edit(string $citySlug, string $slug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $communityPage = CommunityPage::query()->where('city_id', $city->id)->where('slug', $slug)->firstOrFail();
        Gate::authorize('update', $communityPage);
        $cityBaseUrl = self::cityBaseUrl(request(), $citySlug);

        return Inertia::render('CommunityPages/Edit', [
            'city' => $city,
            'communityPage' => $communityPage,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function update(Request $request, string $citySlug, string $slug): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $communityPage = CommunityPage::query()->where('city_id', $city->id)->where('slug', $slug)->firstOrFail();
        Gate::authorize('update', $communityPage);
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'about' => ['nullable', 'string'],
            'event_info' => ['nullable', 'string'],
            'sales_info' => ['nullable', 'string'],
            'contact_address' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
        ]);
        // Approved pages stay approved when updated (do not touch state)
        $communityPage->update($request->only(['name', 'about', 'event_info', 'sales_info', 'contact_address', 'contact_email', 'contact_phone']));
        return redirect()->route('city.community-pages.show', [$citySlug, $communityPage->slug])->with('status', 'Page updated.');
    }
}

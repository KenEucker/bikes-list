<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CommunityPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
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

        $cityBaseUrl = $request->getScheme() . '://' . $citySlug . '.' . $request->getHost() . ($request->getPort() && !in_array($request->getPort(), [80, 443]) ? ':' . $request->getPort() : '');

        return Inertia::render('CommunityPages/Index', [
            'city' => $city,
            'pages' => $pages,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function show(string $citySlug, CommunityPage $communityPage): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($communityPage->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('view', $communityPage);
        $communityPage->load(['city', 'managers', 'listings' => fn ($q) => $q->where('state', 'published')->limit(10), 'events' => fn ($q) => $q->where('state', 'published')->where('ends_at', '>=', now())->orderBy('starts_at')->limit(10)]);

        $cityBaseUrl = request()->getScheme() . '://' . $citySlug . '.' . request()->getHost() . (request()->getPort() && !in_array(request()->getPort(), [80, 443]) ? ':' . request()->getPort() : '');

        return Inertia::render('CommunityPages/Show', [
            'city' => $city,
            'communityPage' => $communityPage,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function create(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        Gate::authorize('create', CommunityPage::class);

        $cityBaseUrl = $request->getScheme() . '://' . $citySlug . '.' . $request->getHost() . ($request->getPort() && !in_array($request->getPort(), [80, 443]) ? ':' . $request->getPort() : '');

        return Inertia::render('CommunityPages/Create', [
            'city' => $city,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function store(Request $request, string $citySlug): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        Gate::authorize('create', CommunityPage::class);
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
        $data['state'] = $request->user()->isEstablished() ? CommunityPage::STATE_APPROVED : CommunityPage::STATE_PENDING;
        $page = CommunityPage::create($data);
        if ($data['state'] === CommunityPage::STATE_APPROVED) {
            $page->managers()->attach($request->user()->id, ['role' => 'owner']);
        }
        return redirect()->route('city.community-pages.show', [$citySlug, $page])->with('status', $page->state === CommunityPage::STATE_APPROVED ? 'Page created.' : 'Page submitted for review.');
    }

    public function edit(string $citySlug, CommunityPage $communityPage): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($communityPage->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('update', $communityPage);
        $cityBaseUrl = request()->getScheme() . '://' . $citySlug . '.' . request()->getHost() . (request()->getPort() && !in_array(request()->getPort(), [80, 443]) ? ':' . request()->getPort() : '');

        return Inertia::render('CommunityPages/Edit', [
            'city' => $city,
            'communityPage' => $communityPage,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function update(Request $request, string $citySlug, CommunityPage $communityPage): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($communityPage->city_id !== $city->id) {
            abort(404);
        }
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
        $communityPage->update($request->only(['name', 'about', 'event_info', 'sales_info', 'contact_address', 'contact_email', 'contact_phone']));
        return redirect()->route('city.community-pages.show', [$citySlug, $communityPage])->with('status', 'Page updated.');
    }
}

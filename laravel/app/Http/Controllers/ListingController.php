<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Listing;
use App\Models\ListingRelayAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    public function index(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $query = Listing::query()
            ->where('city_id', $city->id)
            ->where('state', Listing::STATE_PUBLISHED)
            ->with(['user:id,name', 'relayAddress']);

        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'ilike', '%' . $request->input('q') . '%')
                    ->orWhere('description', 'ilike', '%' . $request->input('q') . '%');
            });
        }
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->input('max_price'));
        }

        $listings = $query->latest('published_at')->paginate(12)->withQueryString();

        return Inertia::render('Listings/Index', [
            'city' => $city,
            'listings' => $listings,
            'filters' => $request->only(['q', 'type', 'min_price', 'max_price']),
            'listingTypes' => config('listing_types'),
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $request->getScheme() . '://' . $citySlug . '.' . $request->getHost() . ($request->getPort() && !in_array($request->getPort(), [80, 443]) ? ':' . $request->getPort() : ''),
        ]);
    }

    public function show(string $citySlug, Listing $listing): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($listing->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('view', $listing);

        $listing->load(['user:id,name', 'city', 'communityPage:id,name', 'relayAddress']);
        if ($listing->state === Listing::STATE_PUBLISHED || $listing->state === Listing::STATE_SOLD) {
            $listing->load('attachments');
        }

        $relayAddress = null;
        if (($listing->state === Listing::STATE_PUBLISHED || $listing->state === Listing::STATE_SOLD) && $listing->relayAddress) {
            $relayAddress = $listing->relayAddress->token . '@' . config('mail.relay_domain', 'reply.bikeslist.example.com');
        }

        $cityBaseUrl = request()->getScheme() . '://' . $citySlug . '.' . request()->getHost() . (request()->getPort() && !in_array(request()->getPort(), [80, 443]) ? ':' . request()->getPort() : '');

        return Inertia::render('Listings/Show', [
            'city' => $city,
            'listing' => $listing,
            'relayEmailAddress' => $relayAddress,
            'listingTypes' => config('listing_types'),
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function create(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        Gate::authorize('create', Listing::class);

        $user = $request->user();
        $managedPages = $user->managedCommunityPages()->where('community_pages.city_id', $city->id)->where('community_pages.state', 'approved')->get();
        $cityBaseUrl = $request->getScheme() . '://' . $citySlug . '.' . $request->getHost() . ($request->getPort() && !in_array($request->getPort(), [80, 443]) ? ':' . $request->getPort() : '');

        return Inertia::render('Listings/Create', [
            'city' => $city,
            'listingTypes' => config('listing_types'),
            'managedCommunityPages' => $managedPages,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function store(Request $request, string $citySlug): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        Gate::authorize('create', Listing::class);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'type' => ['required', 'string', 'in:full_bicycle,parts,clothing,miscellaneous'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'location_address' => ['nullable', 'string', 'max:255'],
            'community_page_id' => ['nullable', 'exists:community_pages,id'],
            'attributes' => ['nullable', 'array'],
        ]);

        $validated['city_id'] = $city->id;
        $validated['user_id'] = $request->user()->id;
        $validated['state'] = Listing::STATE_DRAFT;
        if (isset($validated['community_page_id']) && $validated['community_page_id']) {
            if (!$request->user()->managedCommunityPages()->where('community_pages.id', $validated['community_page_id'])->exists()) {
                abort(403);
            }
        } else {
            $validated['community_page_id'] = null;
        }

        $listing = Listing::create($validated);

        return redirect()->route('city.listings.show', [$citySlug, $listing])
            ->with('status', 'Listing created as draft.');
    }

    public function edit(string $citySlug, Listing $listing): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($listing->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('update', $listing);

        $listing->load('attachments');
        $user = request()->user();
        $managedPages = $user->managedCommunityPages()->where('community_pages.city_id', $city->id)->where('community_pages.state', 'approved')->get();
        $cityBaseUrl = request()->getScheme() . '://' . $citySlug . '.' . request()->getHost() . (request()->getPort() && !in_array(request()->getPort(), [80, 443]) ? ':' . request()->getPort() : '');

        return Inertia::render('Listings/Edit', [
            'city' => $city,
            'listing' => $listing,
            'listingTypes' => config('listing_types'),
            'managedCommunityPages' => $managedPages,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function update(Request $request, string $citySlug, Listing $listing): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($listing->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('update', $listing);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'type' => ['required', 'string', 'in:full_bicycle,parts,clothing,miscellaneous'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'location_address' => ['nullable', 'string', 'max:255'],
            'community_page_id' => ['nullable', 'exists:community_pages,id'],
            'attributes' => ['nullable', 'array'],
        ]);

        if (isset($validated['community_page_id']) && $validated['community_page_id']) {
            if (!$request->user()->managedCommunityPages()->where('community_pages.id', $validated['community_page_id'])->exists()) {
                abort(403);
            }
        } else {
            $validated['community_page_id'] = null;
        }

        $listing->update($validated);

        return redirect()->route('city.listings.show', [$citySlug, $listing])
            ->with('status', 'Listing updated.');
    }

    public function destroy(string $citySlug, Listing $listing): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($listing->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('delete', $listing);

        $listing->update(['state' => Listing::STATE_REMOVED]);

        return redirect()->route('city.listings.index', $citySlug)
            ->with('status', 'Listing removed.');
    }

    public function publish(string $citySlug, Listing $listing): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($listing->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('publish', $listing);

        $listing->update([
            'state' => Listing::STATE_PUBLISHED,
            'published_at' => now(),
        ]);
        $listing->searchable();

        if (!$listing->relayAddress) {
            ListingRelayAddress::create([
                'listing_id' => $listing->id,
                'token' => ListingRelayAddress::generateToken(),
            ]);
        }

        return redirect()->route('city.listings.show', [$citySlug, $listing])
            ->with('status', 'Listing published.');
    }

    public function markSold(string $citySlug, Listing $listing): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($listing->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('markSold', $listing);

        $listing->update(['state' => Listing::STATE_SOLD]);
        $listing->searchable();

        return redirect()->route('city.listings.show', [$citySlug, $listing])
            ->with('status', 'Listing marked as sold.');
    }
}

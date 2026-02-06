<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Listing;
use App\Models\ListingRelayAddress;
use App\Models\Upload;
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
            ->with(['user:id,name', 'relayAddress', 'uploads']);

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
            'cityBaseUrl' => self::cityBaseUrl($request, $citySlug),
        ]);
    }

    public function show(string $citySlug, Listing $listing): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($listing->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('view', $listing);

        $listing->load(['user:id,name', 'city', 'communityPage:id,name', 'relayAddress', 'uploads']);
        if ($listing->state === Listing::STATE_PUBLISHED || $listing->state === Listing::STATE_SOLD) {
            $listing->load('attachments');
        }

        $cityBaseUrl = self::cityBaseUrl(request(), $citySlug);

        $relayAddress = null;
        if (($listing->state === Listing::STATE_PUBLISHED || $listing->state === Listing::STATE_SOLD) && $listing->relayAddress) {
            $relayDomain = parse_url($cityBaseUrl, PHP_URL_HOST) ?? parse_url(config('app.url'), PHP_URL_HOST);
            $relayAddress = 'listing-' . $listing->id . '-' . $listing->relayAddress->token . '@' . $relayDomain;
        }

        $reportRelayDomain = parse_url($cityBaseUrl, PHP_URL_HOST) ?? parse_url(config('app.url'), PHP_URL_HOST);
        $moderatorRelayEmail = 'report-listing-' . $listing->id . '@' . $reportRelayDomain;

        return Inertia::render('Listings/Show', [
            'city' => $city,
            'listing' => $listing,
            'relayEmailAddress' => $relayAddress,
            'moderatorRelayEmail' => $moderatorRelayEmail,
            'bikeIndexUrl' => config('bikeslist.bike_index_search_url'),
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
        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        $listingTypes = config('listing_types');
        $conditions = $listingTypes['conditions'] ?? [];
        unset($listingTypes['conditions']);
        $errors = $request->session()->get('errors');
        $errorBag = $errors && $errors->hasBag('default') ? $errors->getBag('default')->toArray() : [];

        return Inertia::render('Listings/Create', [
            'city' => $city,
            'listingTypes' => $listingTypes,
            'conditions' => $conditions,
            'managedCommunityPages' => $managedPages,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
            'errors' => $errorBag,
            'old' => $request->old(),
        ]);
    }

    public function store(Request $request, string $citySlug): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        Gate::authorize('create', Listing::class);

        $request->merge([
            'community_page_id' => in_array($request->input('community_page_id'), [null, '', 'null'], true) ? null : $request->input('community_page_id'),
            'price' => in_array($request->input('price'), [null, '', 'null'], true) ? null : $request->input('price'),
        ]);

        $validated = $request->validate([
            'title' => ['required', 'string', 'min:6', 'max:80'],
            'description' => ['required', 'string', 'min:20'],
            'type' => ['required', 'string', 'in:full_bicycle,parts,clothing,miscellaneous'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'condition' => ['required', 'string', 'in:new,like_new,good,fair,poor'],
            'location_address' => ['nullable', 'string', 'max:255'],
            'community_page_id' => ['nullable', 'exists:community_pages,id'],
            'attributes' => ['nullable', 'array'],
            'serial_number' => ['nullable', 'string', 'max:100'],
            'serial_private' => ['boolean'],
            'upload_ids' => ['nullable', 'array'],
            'upload_ids.*' => ['uuid', 'exists:uploads,id'],
        ]);

        $validated['city_id'] = $city->id;
        $validated['user_id'] = $request->user()->id;
        $validated['state'] = ($request->boolean('submit_for_review')) ? Listing::STATE_PENDING_REVIEW : Listing::STATE_DRAFT;
        $validated['serial_private'] = $request->boolean('serial_private', true);
        if (isset($validated['community_page_id']) && $validated['community_page_id']) {
            if (!$request->user()->managedCommunityPages()->where('community_pages.id', $validated['community_page_id'])->exists()) {
                abort(403);
            }
        } else {
            $validated['community_page_id'] = null;
        }

        $listing = Listing::create($validated);

        $this->syncListingUploads($listing, $request->input('upload_ids', []), $request->user()->id);

        $status = $listing->state === Listing::STATE_PENDING_REVIEW
            ? 'Listing submitted for review. It will be published automatically if not reviewed by a moderator.'
            : 'Listing created as draft.';

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return redirect()->to($cityBaseUrl . '/listings/' . $listing->id)
            ->with('status', $status);
    }

    public function edit(string $citySlug, Listing $listing): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($listing->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('update', $listing);

        $listing->load(['attachments', 'uploads']);
        $user = request()->user();
        $managedPages = $user->managedCommunityPages()->where('community_pages.city_id', $city->id)->where('community_pages.state', 'approved')->get();
        $cityBaseUrl = self::cityBaseUrl(request(), $citySlug);
        $listingTypes = config('listing_types');
        $conditions = $listingTypes['conditions'] ?? [];
        unset($listingTypes['conditions']);

        return Inertia::render('Listings/Edit', [
            'city' => $city,
            'listing' => $listing,
            'listingTypes' => $listingTypes,
            'conditions' => $conditions,
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
            'title' => ['required', 'string', 'min:6', 'max:80'],
            'description' => ['required', 'string', 'min:20'],
            'type' => ['required', 'string', 'in:full_bicycle,parts,clothing,miscellaneous'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'condition' => ['required', 'string', 'in:new,like_new,good,fair,poor'],
            'location_address' => ['nullable', 'string', 'max:255'],
            'community_page_id' => ['nullable', 'exists:community_pages,id'],
            'attributes' => ['nullable', 'array'],
            'serial_number' => ['nullable', 'string', 'max:100'],
            'serial_private' => ['boolean'],
            'upload_ids' => ['nullable', 'array'],
            'upload_ids.*' => ['uuid', 'exists:uploads,id'],
        ]);

        if (isset($validated['community_page_id']) && $validated['community_page_id']) {
            if (! $request->user()->managedCommunityPages()->where('community_pages.id', $validated['community_page_id'])->exists()) {
                abort(403);
            }
        } else {
            $validated['community_page_id'] = null;
        }

        $validated['serial_private'] = $request->boolean('serial_private', true);
        $listing->update($validated);

        $this->syncListingUploads($listing, $request->input('upload_ids', []), $request->user()->id);

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return redirect()->to($cityBaseUrl . '/listings/' . $listing->id)
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

        if (! $listing->relayAddress) {
            ListingRelayAddress::create([
                'listing_id' => $listing->id,
                'token' => ListingRelayAddress::generateToken(),
            ]);
        }
        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return redirect()->to($cityBaseUrl . '/listings/' . $listing->id)
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

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return redirect()->to($cityBaseUrl . '/listings/' . $listing->id)
            ->with('status', 'Listing marked as sold.');
    }

    private function syncListingUploads(Listing $listing, array $uploadIds, int $userId): void
    {
        $ids = collect($uploadIds)->filter()->unique()->values()->all();
        // Allow READY and PROCESSING so uploads still processing when the form is submitted get attached.
        $allowed = Upload::query()
            ->whereIn('status', [Upload::STATUS_READY, Upload::STATUS_PROCESSING])
            ->where('created_by', $userId)
            ->whereIn('id', $ids)
            ->pluck('id')
            ->all();
        $pivot = [];
        foreach (array_values($allowed) as $i => $id) {
            $pivot[$id] = ['position' => $i];
        }
        $listing->uploads()->sync($pivot);
        Upload::query()
            ->whereIn('id', $allowed)
            ->update(['resource_type' => 'listings', 'resource_id' => (string) $listing->id]);
    }
}

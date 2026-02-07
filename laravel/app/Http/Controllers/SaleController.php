<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Sale;
use App\Models\SaleRelayAddress;
use App\Models\Upload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function index(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $query = Sale::query()
            ->where('city_id', $city->id)
            ->where('state', Sale::STATE_PUBLISHED)
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

        $sales = $query->latest('published_at')->paginate(12)->withQueryString();

        return Inertia::render('Sales/Index', [
            'city' => $city,
            'sales' => $sales,
            'filters' => $request->only(['q', 'type', 'min_price', 'max_price']),
            'saleTypes' => config('sale_types'),
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => self::cityBaseUrl($request, $citySlug),
        ]);
    }

    public function show(string $citySlug, Sale $sale): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($sale->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('view', $sale);

        $sale->load(['user:id,name', 'city', 'communityPage:id,name', 'relayAddress', 'uploads']);
        if ($sale->state === Sale::STATE_PUBLISHED || $sale->state === Sale::STATE_SOLD) {
            $sale->load('attachments');
        }

        $cityBaseUrl = self::cityBaseUrl(request(), $citySlug);

        $relayAddress = null;
        if (($sale->state === Sale::STATE_PUBLISHED || $sale->state === Sale::STATE_SOLD) && $sale->relayAddress) {
            $relayDomain = parse_url($cityBaseUrl, PHP_URL_HOST) ?? parse_url(config('app.url'), PHP_URL_HOST);
            $relayAddress = 'sale-' . $sale->id . '-' . $sale->relayAddress->token . '@' . $relayDomain;
        }

        return Inertia::render('Sales/Show', [
            'city' => $city,
            'sale' => $sale,
            'relayEmailAddress' => $relayAddress,
            'bikeIndexUrl' => config('bikeslist.bike_index_search_url'),
            'saleTypes' => config('sale_types'),
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function create(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        Gate::authorize('create', Sale::class);

        $user = $request->user();
        $managedPages = $user->managedCommunityPages()->where('community_pages.city_id', $city->id)->where('community_pages.state', 'approved')->get();
        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        $saleTypes = config('sale_types');
        $conditions = $saleTypes['conditions'] ?? [];
        unset($saleTypes['conditions']);
        $errors = $request->session()->get('errors');
        $errorBag = $errors && $errors->hasBag('default') ? $errors->getBag('default')->toArray() : [];

        return Inertia::render('Sales/Create', [
            'city' => $city,
            'saleTypes' => $saleTypes,
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
        Gate::authorize('create', Sale::class);

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
        $validated['state'] = ($request->boolean('submit_for_review')) ? Sale::STATE_PENDING_REVIEW : Sale::STATE_DRAFT;
        $validated['serial_private'] = $request->boolean('serial_private', true);
        if (isset($validated['community_page_id']) && $validated['community_page_id']) {
            if (!$request->user()->managedCommunityPages()->where('community_pages.id', $validated['community_page_id'])->exists()) {
                abort(403);
            }
        } else {
            $validated['community_page_id'] = null;
        }

        $sale = Sale::create($validated);

        $this->syncSaleUploads($sale, $request->input('upload_ids', []), $request->user()->id);

        $status = $sale->state === Sale::STATE_PENDING_REVIEW
            ? 'Sale submitted for review. It will be published automatically if not reviewed by a moderator.'
            : 'Sale created as draft.';

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return redirect()->to($cityBaseUrl . '/for-sale/' . $sale->id)
            ->with('status', $status);
    }

    public function edit(string $citySlug, Sale $sale): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($sale->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('update', $sale);

        $sale->load(['attachments', 'uploads']);
        $user = request()->user();
        $managedPages = $user->managedCommunityPages()->where('community_pages.city_id', $city->id)->where('community_pages.state', 'approved')->get();
        $cityBaseUrl = self::cityBaseUrl(request(), $citySlug);
        $saleTypes = config('sale_types');
        $conditions = $saleTypes['conditions'] ?? [];
        unset($saleTypes['conditions']);

        return Inertia::render('Sales/Edit', [
            'city' => $city,
            'sale' => $sale,
            'saleTypes' => $saleTypes,
            'conditions' => $conditions,
            'managedCommunityPages' => $managedPages,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function update(Request $request, string $citySlug, Sale $sale): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($sale->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('update', $sale);

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
        $sale->update($validated);

        $this->syncSaleUploads($sale, $request->input('upload_ids', []), $request->user()->id);

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return redirect()->to($cityBaseUrl . '/for-sale/' . $sale->id)
            ->with('status', 'Sale updated.');
    }

    public function destroy(string $citySlug, Sale $sale): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($sale->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('delete', $sale);

        $sale->update(['state' => Sale::STATE_REMOVED]);

        return redirect()->to(self::cityBaseUrl(request(), $citySlug) . '/for-sale')
            ->with('status', 'Sale removed.');
    }

    public function publish(Request $request, string $citySlug, Sale $sale): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($sale->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('publish', $sale);

        $sale->update([
            'state' => Sale::STATE_PUBLISHED,
            'published_at' => now(),
        ]);
        $sale->searchable();

        if (! $sale->relayAddress) {
            SaleRelayAddress::create([
                'sale_id' => $sale->id,
                'token' => SaleRelayAddress::generateToken(),
            ]);
        }
        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return redirect()->to($cityBaseUrl . '/for-sale/' . $sale->id)
            ->with('status', 'Sale published.');
    }

    public function markSold(Request $request, string $citySlug, Sale $sale): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($sale->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('markSold', $sale);

        $sale->update(['state' => Sale::STATE_SOLD]);
        $sale->searchable();

        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        return redirect()->to($cityBaseUrl . '/for-sale/' . $sale->id)
            ->with('status', 'Sale marked as sold.');
    }

    private function syncSaleUploads(Sale $sale, array $uploadIds, int $userId): void
    {
        $ids = collect($uploadIds)->filter()->unique()->values()->all();
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
        $sale->uploads()->sync($pivot);
        Upload::query()
            ->whereIn('id', $allowed)
            ->update(['resource_type' => 'sales', 'resource_id' => (string) $sale->id]);
    }
}

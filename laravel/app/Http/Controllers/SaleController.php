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

        $bikeIndexBase = rtrim(config('bikeslist.bike_index_search_url'), '/');
        $bikeIndexUrl = $bikeIndexBase . '/registrations?' . self::bikeIndexSearchParams($sale, $city);

        $serialNumberDisplay = ($sale->serial_number && filter_var($sale->serial_private, FILTER_VALIDATE_BOOLEAN) === false)
            ? $sale->serial_number
            : null;

        return Inertia::render('Sales/Show', [
            'city' => $city,
            'sale' => $sale,
            'serial_number_display' => $serialNumberDisplay,
            'relayEmailAddress' => $relayAddress,
            'bikeIndexUrl' => $bikeIndexUrl,
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
        $managedPages = $user
            ? $user->managedCommunityPages()->where('community_pages.city_id', $city->id)->where('community_pages.state', 'approved')->get()
            : [];
        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);

        $saleTypes = config('sale_types');
        $conditions = $saleTypes['conditions'] ?? [];
        $fullBicycleOptions = $saleTypes['full_bicycle_options'] ?? [];
        unset($saleTypes['conditions'], $saleTypes['full_bicycle_options']);
        $errors = $request->session()->get('errors');
        $errorBag = $errors && $errors->hasBag('default') ? $errors->getBag('default')->toArray() : [];

        return Inertia::render('Sales/Create', [
            'city' => $city,
            'saleTypes' => $saleTypes,
            'conditions' => $conditions,
            'fullBicycleOptions' => $fullBicycleOptions,
            'managedCommunityPages' => $managedPages,
            'authUser' => $user ? ['id' => $user->id, 'email' => $user->email] : null,
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

        $user = $request->user();
        $request->merge([
            'community_page_id' => in_array($request->input('community_page_id'), [null, '', 'null'], true) ? null : $request->input('community_page_id'),
            'price' => in_array($request->input('price'), [null, '', 'null'], true) ? null : $request->input('price'),
        ]);

        $rules = [
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
        ];

        if (! $user) {
            $rules['contact_email'] = ['required', 'email'];
        }

        if ($request->input('type') === 'full_bicycle') {
            $rules['frame_size'] = ['nullable', 'string', 'max:50'];
            $rules['make'] = ['nullable', 'string', 'max:100'];
            $rules['model'] = ['nullable', 'string', 'max:100'];
            $rules['bicycle_type'] = ['nullable', 'string', 'max:50'];
            $rules['wheel_size'] = ['nullable', 'string', 'max:20'];
            $rules['frame_material'] = ['nullable', 'string', 'max:50'];
            $rules['suspension'] = ['nullable', 'string', 'max:50'];
            $rules['handlebar_type'] = ['nullable', 'string', 'max:50'];
            $rules['electric_assist'] = ['nullable', 'string', 'max:50'];
        }

        $validated = $request->validate($rules);

        $validated['city_id'] = $city->id;
        $validated['user_id'] = $user?->id;
        $validated['contact_email'] = $user ? $user->email : $request->input('contact_email');
        $validated['state'] = ($request->boolean('submit_for_review')) ? Sale::STATE_PENDING_REVIEW : Sale::STATE_DRAFT;
        $validated['serial_private'] = filter_var($request->input('serial_private', true), FILTER_VALIDATE_BOOLEAN);

        if ($user && isset($validated['community_page_id']) && $validated['community_page_id']) {
            if (! $user->managedCommunityPages()->where('community_pages.id', $validated['community_page_id'])->exists()) {
                abort(403);
            }
        } else {
            $validated['community_page_id'] = null;
        }

        $sale = Sale::create($validated);

        SaleCreated::dispatch($sale);

        if ($user) {
            $this->syncSaleUploads($sale, $request->input('upload_ids', []), $user->id);
        } else {
            $request->session()->push('guest_created_sale_ids', $sale->id);
            $request->session()->put('guest_created_sale_ids', array_slice($request->session()->get('guest_created_sale_ids', []), -20));
        }

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
        $fullBicycleOptions = $saleTypes['full_bicycle_options'] ?? [];
        unset($saleTypes['conditions'], $saleTypes['full_bicycle_options']);

        return Inertia::render('Sales/Edit', [
            'city' => $city,
            'sale' => $sale,
            'saleTypes' => $saleTypes,
            'conditions' => $conditions,
            'fullBicycleOptions' => $fullBicycleOptions,
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

        $updateRules = [
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
        ];
        if ($request->input('type') === 'full_bicycle') {
            $updateRules['frame_size'] = ['nullable', 'string', 'max:50'];
            $updateRules['make'] = ['nullable', 'string', 'max:100'];
            $updateRules['model'] = ['nullable', 'string', 'max:100'];
            $updateRules['bicycle_type'] = ['nullable', 'string', 'max:50'];
            $updateRules['wheel_size'] = ['nullable', 'string', 'max:20'];
            $updateRules['frame_material'] = ['nullable', 'string', 'max:50'];
            $updateRules['suspension'] = ['nullable', 'string', 'max:50'];
            $updateRules['handlebar_type'] = ['nullable', 'string', 'max:50'];
            $updateRules['electric_assist'] = ['nullable', 'string', 'max:50'];
        }
        $validated = $request->validate($updateRules);

        if (isset($validated['community_page_id']) && $validated['community_page_id']) {
            if (! $request->user()->managedCommunityPages()->where('community_pages.id', $validated['community_page_id'])->exists()) {
                abort(403);
            }
        } else {
            $validated['community_page_id'] = null;
        }

        $validated['serial_private'] = filter_var($request->input('serial_private', true), FILTER_VALIDATE_BOOLEAN);
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

    /**
     * Build Bike Index registrations search query string (serial, location, query_items, distance, stolenness).
     */
    private static function bikeIndexSearchParams(Sale $sale, City $city): string
    {
        $opts = config('sale_types.full_bicycle_options', []);
        $params = [
            'distance' => '100',
            'stolenness' => 'proximity',
            'serial' => '',
            'location' => '',
            'query_items' => '',
        ];

        if ($sale->serial_number && ! $sale->serial_private) {
            $params['serial'] = $sale->serial_number;
        }

        $params['location'] = trim((string) ($city->name ?? ''));

        $queryParts = array_filter([
            $sale->make,
            $sale->model,
            $sale->bicycle_type ? ($opts['bicycle_type'][$sale->bicycle_type] ?? $sale->bicycle_type) : null,
        ]);
        $params['query_items'] = implode(' ', $queryParts);

        return http_build_query($params);
    }
}

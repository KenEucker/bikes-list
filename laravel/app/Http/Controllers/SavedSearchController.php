<?php

namespace App\Http\Controllers;

use App\Models\SavedSearch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SavedSearchController extends Controller
{
    public function index(Request $request): Response
    {
        $savedSearches = $request->user()
            ->savedSearches()
            ->with('city:id,name,slug')
            ->latest()
            ->get();

        $prefill = null;
        if ($request->boolean('save') && $request->has('city_id')) {
            $prefill = [
                'city_id' => $request->input('city_id'),
                'name' => $request->input('name', 'Saved search'),
                'query' => [
                    'q' => $request->input('query.q'),
                    'type' => $request->input('query.type'),
                    'min_price' => $request->input('query.min_price'),
                    'max_price' => $request->input('query.max_price'),
                ],
            ];
        }

        return Inertia::render('Profile/SavedSearches', [
            'savedSearches' => $savedSearches,
            'prefill' => $prefill,
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'city_id' => ['required', 'exists:cities,id'],
            'name' => ['required', 'string', 'max:255'],
            'query' => ['required', 'array'],
            'query.q' => ['nullable', 'string'],
            'query.type' => ['nullable', 'string'],
            'query.min_price' => ['nullable', 'numeric'],
            'query.max_price' => ['nullable', 'numeric'],
        ]);

        $request->user()->savedSearches()->create($validated);

        return redirect()->route('saved-searches.index')->with('status', 'Search saved.');
    }

    public function update(Request $request, SavedSearch $savedSearch): \Illuminate\Http\RedirectResponse
    {
        if ($savedSearch->user_id !== $request->user()->id) {
            abort(403);
        }
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);
        $savedSearch->update($validated);
        return redirect()->route('saved-searches.index')->with('status', 'Saved search updated.');
    }

    public function destroy(Request $request, SavedSearch $savedSearch): \Illuminate\Http\RedirectResponse
    {
        if ($savedSearch->user_id !== $request->user()->id) {
            abort(403);
        }
        $savedSearch->delete();
        return redirect()->route('saved-searches.index')->with('status', 'Saved search deleted.');
    }
}

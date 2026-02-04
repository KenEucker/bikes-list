<?php

namespace App\Http\Controllers;

use App\Models\Flag;
use App\Models\Listing;
use Illuminate\Http\Request;

class FlagController extends Controller
{
    public function store(Request $request, string $citySlug, Listing $listing): \Illuminate\Http\RedirectResponse
    {
        $city = \App\Models\City::query()->where('slug', $citySlug)->firstOrFail();
        if ($listing->city_id !== $city->id) {
            abort(404);
        }
        $request->validate(['reason' => ['nullable', 'string', 'max:1000']]);

        Flag::firstOrCreate(
            [
                'flaggable_type' => Listing::class,
                'flaggable_id' => $listing->id,
                'user_id' => $request->user()->id,
            ],
            ['reason' => $request->input('reason')]
        );

        return back()->with('status', 'Listing flagged. Moderators will review.');
    }
}

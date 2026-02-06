<?php

namespace App\Http\Controllers;

use App\Models\Flag;
use App\Models\Sale;
use Illuminate\Http\Request;

class FlagController extends Controller
{
    public function store(Request $request, string $citySlug, Sale $sale): \Illuminate\Http\RedirectResponse
    {
        $city = \App\Models\City::query()->where('slug', $citySlug)->firstOrFail();
        if ($sale->city_id !== $city->id) {
            abort(404);
        }
        $request->validate(['reason' => ['nullable', 'string', 'max:1000']]);

        Flag::firstOrCreate(
            [
                'flaggable_type' => Sale::class,
                'flaggable_id' => $sale->id,
                'user_id' => $request->user()->id,
            ],
            ['reason' => $request->input('reason')]
        );

        return back()->with('status', 'Sale flagged. Moderators will review.');
    }
}

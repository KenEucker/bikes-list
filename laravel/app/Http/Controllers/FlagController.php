<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Flag;
use App\Models\Sale;
use Illuminate\Http\Request;

class FlagController extends Controller
{
    /**
     * Flag a sale (Craigslist-style). Works for both guests and authenticated users.
     * One flag per sale per user (auth) or per session (guest).
     */
    public function store(Request $request, string $citySlug, Sale $sale): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($sale->city_id !== $city->id) {
            abort(404);
        }
        $request->validate(['reason' => ['nullable', 'string', 'max:1000']]);

        $user = $request->user();
        $reason = $request->input('reason');

        if ($user) {
            Flag::firstOrCreate(
                [
                    'flaggable_type' => Sale::class,
                    'flaggable_id' => $sale->id,
                    'user_id' => $user->id,
                    'session_id' => null,
                ],
                ['reason' => $reason]
            );
        } else {
            Flag::firstOrCreate(
                [
                    'flaggable_type' => Sale::class,
                    'flaggable_id' => $sale->id,
                    'user_id' => null,
                    'session_id' => $request->session()->getId(),
                ],
                ['reason' => $reason]
            );
        }

        return back()->with('status', __('This listing has been flagged. Moderators will review it.'));
    }
}

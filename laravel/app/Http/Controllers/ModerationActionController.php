<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CommunityPage;
use App\Models\Ride;
use App\Models\Sale;
use App\Models\SaleRelayAddress;
use App\Models\ModerationAction;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class ModerationActionController extends Controller
{
    public function approveSale(Request $request, Sale $sale): RedirectResponse
    {
        $citySlug = $request->route('city');
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);
        if ($sale->city_id !== $city->id || $sale->state !== Sale::STATE_PENDING_REVIEW) {
            abort(404);
        }

        $sale->update(['state' => Sale::STATE_PUBLISHED, 'published_at' => now()]);
        $sale->searchable();
        if (! $sale->relayAddress) {
            SaleRelayAddress::create(['sale_id' => $sale->id, 'token' => SaleRelayAddress::generateToken()]);
        }
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'approved',
            'subject_type' => Sale::class,
            'subject_id' => $sale->id,
            'reason' => $request->input('note'),
        ]);

        return redirect()->route('city.moderation.sales', $citySlug)->with('status', 'Sale published.');
    }

    public function removeSale(Request $request, Sale $sale): RedirectResponse
    {
        $citySlug = $request->route('city');
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);
        if ($sale->city_id !== $city->id) {
            abort(404);
        }
        $request->validate(['note' => ['required', 'string', 'max:2000']]);

        $sale->update(['state' => Sale::STATE_REMOVED]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'removed',
            'subject_type' => Sale::class,
            'subject_id' => $sale->id,
            'reason' => $request->input('note'),
        ]);

        return redirect()->route('city.moderation.sales', $citySlug)->with('status', 'Sale removed.');
    }

    public function approveRide(Request $request, Ride $ride): RedirectResponse
    {
        $citySlug = $request->route('city');
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);
        if ($ride->city_id !== $city->id || $ride->state !== Ride::STATE_PENDING_REVIEW) {
            abort(404);
        }

        $ride->update(['state' => Ride::STATE_PUBLISHED, 'published_at' => now()]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'approved',
            'subject_type' => Ride::class,
            'subject_id' => $ride->id,
            'reason' => $request->input('note'),
        ]);

        return redirect()->route('city.moderation.rides', $citySlug)->with('status', 'Ride published.');
    }

    public function removeRide(Request $request, Ride $ride): RedirectResponse
    {
        $citySlug = $request->route('city');
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);
        if ($ride->city_id !== $city->id) {
            abort(404);
        }
        $request->validate(['note' => ['required', 'string', 'max:2000']]);

        $ride->update(['state' => Ride::STATE_REMOVED]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'removed',
            'subject_type' => Ride::class,
            'subject_id' => $ride->id,
            'reason' => $request->input('note'),
        ]);

        return redirect()->route('city.moderation.rides', $citySlug)->with('status', 'Ride removed.');
    }

    public function approvePage(Request $request, string $citySlug, CommunityPage $page): RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);
        if ($page->city_id !== $city->id || $page->state !== CommunityPage::STATE_PENDING) {
            abort(404);
        }

        $page->update(['state' => CommunityPage::STATE_APPROVED]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'approved',
            'subject_type' => CommunityPage::class,
            'subject_id' => $page->id,
            'reason' => $request->input('note'),
        ]);

        return redirect()->route('city.moderation.pages', $citySlug)->with('status', 'Page approved.');
    }

    public function removePage(Request $request, CommunityPage $page): RedirectResponse
    {
        $citySlug = $request->route('city');
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);
        if ($page->city_id !== $city->id) {
            abort(404);
        }
        $request->validate(['note' => ['required', 'string', 'max:2000']]);

        $page->update(['state' => CommunityPage::STATE_REMOVED]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'removed',
            'subject_type' => CommunityPage::class,
            'subject_id' => $page->id,
            'reason' => $request->input('note'),
        ]);

        return redirect()->route('city.moderation.pages', $citySlug)->with('status', 'Page removed.');
    }

    private function authorizeModerator($user, City $city): void
    {
        if (! $user || ! $user->moderatedCities()->where('cities.id', $city->id)->exists()) {
            abort(403, 'Not authorized to moderate this city.');
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CommunityPage;
use App\Models\Event;
use App\Models\Listing;
use App\Models\ListingRelayAddress;
use App\Models\ModerationAction;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class ModerationActionController extends Controller
{
    public function approveListing(Request $request, Listing $listing): RedirectResponse
    {
        $citySlug = $request->route('city');
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);
        if ($listing->city_id !== $city->id || $listing->state !== Listing::STATE_PENDING_REVIEW) {
            abort(404);
        }

        $listing->update(['state' => Listing::STATE_PUBLISHED, 'published_at' => now()]);
        $listing->searchable();
        if (! $listing->relayAddress) {
            ListingRelayAddress::create(['listing_id' => $listing->id, 'token' => ListingRelayAddress::generateToken()]);
        }
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'approved',
            'subject_type' => Listing::class,
            'subject_id' => $listing->id,
            'reason' => $request->input('note'),
        ]);

        return redirect()->route('city.moderation.listings', $citySlug)->with('status', 'Listing published.');
    }

    public function removeListing(Request $request, Listing $listing): RedirectResponse
    {
        $citySlug = $request->route('city');
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);
        if ($listing->city_id !== $city->id) {
            abort(404);
        }
        $request->validate(['note' => ['required', 'string', 'max:2000']]);

        $listing->update(['state' => Listing::STATE_REMOVED]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'removed',
            'subject_type' => Listing::class,
            'subject_id' => $listing->id,
            'reason' => $request->input('note'),
        ]);

        return redirect()->route('city.moderation.listings', $citySlug)->with('status', 'Listing removed.');
    }

    public function approveEvent(Request $request, Event $event): RedirectResponse
    {
        $citySlug = $request->route('city');
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);
        if ($event->city_id !== $city->id || $event->state !== Event::STATE_PENDING_REVIEW) {
            abort(404);
        }

        $event->update(['state' => Event::STATE_PUBLISHED, 'published_at' => now()]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'approved',
            'subject_type' => Event::class,
            'subject_id' => $event->id,
            'reason' => $request->input('note'),
        ]);

        return redirect()->route('city.moderation.events', $citySlug)->with('status', 'Event published.');
    }

    public function removeEvent(Request $request, Event $event): RedirectResponse
    {
        $citySlug = $request->route('city');
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $city);
        if ($event->city_id !== $city->id) {
            abort(404);
        }
        $request->validate(['note' => ['required', 'string', 'max:2000']]);

        $event->update(['state' => Event::STATE_REMOVED]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'removed',
            'subject_type' => Event::class,
            'subject_id' => $event->id,
            'reason' => $request->input('note'),
        ]);

        return redirect()->route('city.moderation.events', $citySlug)->with('status', 'Event removed.');
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

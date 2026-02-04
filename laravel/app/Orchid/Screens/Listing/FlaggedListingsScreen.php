<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Listing;

use App\Models\Flag;
use App\Models\Listing;
use App\Models\ModerationAction;
use App\Orchid\Layouts\Listing\FlaggedListingListLayout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Toast;

class FlaggedListingsScreen extends Screen
{
    public function query(): iterable
    {
        $listingIds = Flag::query()
            ->where('flaggable_type', Listing::class)
            ->select('flaggable_id')
            ->distinct()
            ->pluck('flaggable_id');

        $query = Listing::query()
            ->with(['city', 'user'])
            ->withCount('flags')
            ->whereIn('id', $listingIds);

        $user = auth()->user();
        if ($user && $user->moderatedCities()->exists()) {
            $cityIds = $user->moderatedCities()->pluck('id');
            $query->whereIn('city_id', $cityIds);
        }

        return [
            'listings' => $query->orderByDesc('updated_at')->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Flagged listings');
    }

    public function description(): ?string
    {
        return __('Listings that have been flagged by users. Revert to draft or remove.');
    }

    public function permission(): ?iterable
    {
        return ['platform.moderation.flagged'];
    }

    public function layout(): iterable
    {
        return [
            FlaggedListingListLayout::class,
        ];
    }

    public function revertToDraft(Request $request): \Illuminate\Http\RedirectResponse
    {
        $listing = Listing::findOrFail($request->input('listing'));
        $listing->update(['state' => Listing::STATE_DRAFT]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'reverted_to_draft',
            'subject_type' => Listing::class,
            'subject_id' => $listing->id,
        ]);
        Log::info('Moderation action', [
            'action' => 'reverted_to_draft',
            'subject_type' => Listing::class,
            'subject_id' => $listing->id,
            'user_id' => $request->user()->id,
        ]);
        Toast::info(__('Listing reverted to draft.'));
        return back();
    }

    public function remove(Request $request): \Illuminate\Http\RedirectResponse
    {
        $listing = Listing::findOrFail($request->input('listing'));
        $listing->update(['state' => Listing::STATE_REMOVED]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'removed',
            'subject_type' => Listing::class,
            'subject_id' => $listing->id,
        ]);
        Log::info('Moderation action', [
            'action' => 'removed',
            'subject_type' => Listing::class,
            'subject_id' => $listing->id,
            'user_id' => $request->user()->id,
        ]);
        Toast::info(__('Listing removed.'));
        return back();
    }
}

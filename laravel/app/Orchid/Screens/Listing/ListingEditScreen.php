<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Listing;

use App\Models\Listing;
use App\Models\ListingRelayAddress;
use App\Models\ModerationAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class ListingEditScreen extends Screen
{
    public ?Listing $listing = null;

    public function query(Listing $listing): iterable
    {
        $this->listing = $listing;
        $listing->load(['city', 'user', 'communityPage', 'relayAddress', 'uploads']);
        return [
            'listing' => $listing,
        ];
    }

    public function name(): ?string
    {
        return __('Listing');
    }

    public function description(): ?string
    {
        return $this->listing?->title ?? __('View listing');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.listings'];
    }

    public function commandBar(): iterable
    {
        return [
            Button::make(__('Approve / Publish'))
                ->icon('bs.check-circle')
                ->method('approve')
                ->canSee(in_array($this->listing->state, [Listing::STATE_DRAFT, Listing::STATE_PENDING_REVIEW])),
            Button::make(__('Revert to draft'))
                ->icon('bs.arrow-counterclockwise')
                ->method('revertToDraft')
                ->canSee($this->listing->state === Listing::STATE_PUBLISHED),
            Button::make(__('Remove'))
                ->icon('bs.trash3')
                ->confirm(__('Remove this listing from public view?'))
                ->method('remove'),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::view('orchid.listing-view', ['listing' => $this->listing]),
        ];
    }

    public function approve(Request $request, Listing $listing)
    {
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
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'approved',
            'subject_type' => Listing::class,
            'subject_id' => $listing->id,
        ]);
        Toast::success(__('Listing approved and published.'));
        return back();
    }

    public function revertToDraft(Request $request, Listing $listing)
    {
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

    public function remove(Request $request, Listing $listing)
    {
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
        return redirect()->route('platform.systems.listings');
    }
}

<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Ride;

use App\Models\ModerationAction;
use App\Models\Ride;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class RideEditScreen extends Screen
{
    public ?Ride $ride = null;

    public function query(Ride $ride): iterable
    {
        $this->ride = $ride;
        $ride->load(['city', 'user', 'communityPage', 'audience']);
        return [
            'ride' => $ride,
        ];
    }

    public function name(): ?string
    {
        return __('Ride');
    }

    public function description(): ?string
    {
        return $this->ride?->name ?? __('View ride');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.rides'];
    }

    public function commandBar(): iterable
    {
        return [
            Button::make(__('Approve / Publish'))
                ->icon('bs.check-circle')
                ->method('approve')
                ->canSee(in_array($this->ride->state, [Ride::STATE_DRAFT, Ride::STATE_PENDING_REVIEW])),
            Button::make(__('Revert to draft'))
                ->icon('bs.arrow-counterclockwise')
                ->method('revertToDraft')
                ->canSee($this->ride->state === Ride::STATE_PUBLISHED),
            Button::make(__('Remove'))
                ->icon('bs.trash3')
                ->confirm(__('Remove this ride?'))
                ->method('remove'),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::view('orchid.ride-view', ['ride' => $this->ride]),
        ];
    }

    public function approve(Request $request, Ride $ride)
    {
        $ride->update([
            'state' => Ride::STATE_PUBLISHED,
            'published_at' => now(),
        ]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'approved',
            'subject_type' => Ride::class,
            'subject_id' => $ride->id,
        ]);
        Toast::success(__('Ride approved and published.'));
        return back();
    }

    public function revertToDraft(Request $request, Ride $ride)
    {
        $ride->update(['state' => Ride::STATE_DRAFT]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'reverted_to_draft',
            'subject_type' => Ride::class,
            'subject_id' => $ride->id,
        ]);
        Log::info('Moderation action', [
            'action' => 'reverted_to_draft',
            'subject_type' => Ride::class,
            'subject_id' => $ride->id,
            'user_id' => $request->user()->id,
        ]);
        Toast::info(__('Ride reverted to draft.'));
        return back();
    }

    public function remove(Request $request, Ride $ride)
    {
        $ride->update(['state' => Ride::STATE_REMOVED]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'removed',
            'subject_type' => Ride::class,
            'subject_id' => $ride->id,
        ]);
        Log::info('Moderation action', [
            'action' => 'removed',
            'subject_type' => Ride::class,
            'subject_id' => $ride->id,
            'user_id' => $request->user()->id,
        ]);
        Toast::info(__('Ride removed.'));
        return redirect()->route('platform.systems.rides');
    }
}

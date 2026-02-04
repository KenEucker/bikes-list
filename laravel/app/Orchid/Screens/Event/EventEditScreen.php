<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Event;

use App\Models\Event;
use App\Models\ModerationAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class EventEditScreen extends Screen
{
    public ?Event $event = null;

    public function query(Event $event): iterable
    {
        $this->event = $event;
        $event->load(['city', 'user', 'communityPage']);
        return [
            'event' => $event,
        ];
    }

    public function name(): ?string
    {
        return __('Event');
    }

    public function description(): ?string
    {
        return $this->event?->title ?? __('View event');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.events'];
    }

    public function commandBar(): iterable
    {
        return [
            Button::make(__('Revert to draft'))
                ->icon('bs.arrow-counterclockwise')
                ->method('revertToDraft')
                ->canSee($this->event->state === Event::STATE_PUBLISHED),
            Button::make(__('Remove'))
                ->icon('bs.trash3')
                ->confirm(__('Remove this event?'))
                ->method('remove'),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::view('orchid.event-view', ['event' => $this->event]),
        ];
    }

    public function revertToDraft(Request $request, Event $event)
    {
        $event->update(['state' => Event::STATE_DRAFT]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'reverted_to_draft',
            'subject_type' => Event::class,
            'subject_id' => $event->id,
        ]);
        Log::info('Moderation action', [
            'action' => 'reverted_to_draft',
            'subject_type' => Event::class,
            'subject_id' => $event->id,
            'user_id' => $request->user()->id,
        ]);
        Toast::info(__('Event reverted to draft.'));
        return back();
    }

    public function remove(Request $request, Event $event)
    {
        $event->update(['state' => Event::STATE_REMOVED]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'removed',
            'subject_type' => Event::class,
            'subject_id' => $event->id,
        ]);
        Log::info('Moderation action', [
            'action' => 'removed',
            'subject_type' => Event::class,
            'subject_id' => $event->id,
            'user_id' => $request->user()->id,
        ]);
        Toast::info(__('Event removed.'));
        return redirect()->route('platform.systems.events');
    }
}

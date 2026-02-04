<?php

namespace App\Jobs;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RecurringEventExpiryReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $oneMonthFromNow = now()->addMonth();
        Event::query()
            ->where('is_recurring', true)
            ->whereNotNull('recurrence_ends_at')
            ->whereBetween('recurrence_ends_at', [now(), $oneMonthFromNow])
            ->with('user')
            ->each(function (Event $event) {
                // TODO: Send email to $event->user: "Your recurring event expires in one month. Confirm it still exists and re-accept guidelines."
            });
    }
}

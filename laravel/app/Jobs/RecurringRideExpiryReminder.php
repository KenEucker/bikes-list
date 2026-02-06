<?php

namespace App\Jobs;

use App\Models\Ride;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RecurringRideExpiryReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $oneMonthFromNow = now()->addMonth();
        Ride::query()
            ->where('is_recurring', true)
            ->whereNotNull('recurrence_ends_at')
            ->whereBetween('recurrence_ends_at', [now(), $oneMonthFromNow])
            ->with('user')
            ->each(function (Ride $ride) {
                // TODO: Send email to $ride->user: "Your recurring ride expires in one month. Confirm it still exists and re-accept guidelines."
            });
    }
}

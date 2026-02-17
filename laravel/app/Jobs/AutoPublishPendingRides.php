<?php

namespace App\Jobs;

use App\Models\Ride;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AutoPublishPendingRides implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $hoursPending = 48
    ) {}

    public function handle(): void
    {
        $cutoff = now()->subHours($this->hoursPending);
        Ride::query()
            ->where('state', Ride::STATE_PENDING_REVIEW)
            ->where('submitted_at', '<=', $cutoff)
            ->each(function (Ride $ride) {
                $ride->update([
                    'state' => Ride::STATE_PUBLISHED,
                    'published_at' => now(),
                ]);
            });
    }
}

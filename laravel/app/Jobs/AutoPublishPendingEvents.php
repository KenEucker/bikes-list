<?php

namespace App\Jobs;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AutoPublishPendingEvents implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $hoursPending = 48
    ) {}

    public function handle(): void
    {
        $cutoff = now()->subHours($this->hoursPending);
        Event::query()
            ->where('state', Event::STATE_PENDING_REVIEW)
            ->where('submitted_at', '<=', $cutoff)
            ->each(function (Event $event) {
                $event->update([
                    'state' => Event::STATE_PUBLISHED,
                    'published_at' => now(),
                ]);
            });
    }
}

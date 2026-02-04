<?php

namespace App\Jobs;

use App\Domain\Listings\Listing;
use App\Services\SpamDetectionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SpamCheckJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $listingId
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(SpamDetectionService $spamService): void
    {
        $listing = Listing::with('user')->find($this->listingId);

        if (!$listing) {
            return;
        }

        $result = $spamService->checkListing($listing);

        if ($result['flagged']) {
            $listing->update(['status' => 'flagged']);
        }

        if ($result['suspend_user']) {
            $listing->user->update(['status' => 'suspended']);
        }
    }
}

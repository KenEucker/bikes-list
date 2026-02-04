<?php

namespace App\Jobs;

use App\Services\SearchService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RemoveListingFromIndexJob implements ShouldQueue
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
    public function handle(SearchService $searchService): void
    {
        $searchService->removeListing($this->listingId);
    }
}

<?php

namespace App\Jobs;

use App\Domain\Listings\Listing;
use App\Services\SearchService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class IndexListingJob implements ShouldQueue
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
        $listing = Listing::with(['region', 'images' => function ($query) {
            $query->where('variant', 'thumb')->first();
        }])->find($this->listingId);

        if (!$listing || $listing->status !== 'active') {
            return;
        }

        $searchService->indexListing($listing);
    }
}

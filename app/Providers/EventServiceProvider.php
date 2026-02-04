<?php

namespace App\Providers;

use App\Domain\Listings\Listing;
use App\Jobs\IndexListingJob;
use App\Jobs\RemoveListingFromIndexJob;
use App\Jobs\SpamCheckJob;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        //
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        // Dispatch indexing job when listing is published
        Listing::created(function ($listing) {
            SpamCheckJob::dispatch($listing->id);
        });

        Listing::updated(function ($listing) {
            if ($listing->status === 'active' && $listing->published_at) {
                IndexListingJob::dispatch($listing->id);
            } elseif ($listing->isDirty('status') && $listing->status !== 'active') {
                RemoveListingFromIndexJob::dispatch($listing->id);
            }
        });

        Listing::deleted(function ($listing) {
            RemoveListingFromIndexJob::dispatch($listing->id);
        });
    }
}

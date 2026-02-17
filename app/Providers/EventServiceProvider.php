<?php

namespace App\Providers;

use App\Domain\Sales\Sale;
use App\Jobs\IndexSaleJob;
use App\Jobs\RemoveSaleFromIndexJob;
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
        // Dispatch indexing job when sale is published
        Sale::created(function ($sale) {
            SpamCheckJob::dispatch($sale->id);
        });

        Sale::updated(function ($sale) {
            if ($sale->status === 'active' && $sale->published_at) {
                IndexSaleJob::dispatch($sale->id);
            } elseif ($sale->isDirty('status') && $sale->status !== 'active') {
                RemoveSaleFromIndexJob::dispatch($sale->id);
            }
        });

        Sale::deleted(function ($sale) {
            RemoveSaleFromIndexJob::dispatch($sale->id);
        });
    }
}

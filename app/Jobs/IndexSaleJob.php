<?php

namespace App\Jobs;

use App\Domain\Sales\Sale;
use App\Services\SearchService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class IndexSaleJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $saleId
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(SearchService $searchService): void
    {
        $sale = Sale::with(['region', 'images' => function ($query) {
            $query->where('variant', 'thumb')->first();
        }])->find($this->saleId);

        if (!$sale || $sale->status !== 'active') {
            return;
        }

        $searchService->indexSale($sale);
    }
}

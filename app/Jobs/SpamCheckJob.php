<?php

namespace App\Jobs;

use App\Domain\Sales\Sale;
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
        public int $saleId
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(SpamDetectionService $spamService): void
    {
        $sale = Sale::with('user')->find($this->saleId);

        if (!$sale) {
            return;
        }

        $result = $spamService->checkSale($sale);

        if ($result['flagged']) {
            $sale->update(['status' => 'flagged']);
        }

        if ($result['suspend_user']) {
            $sale->user->update(['status' => 'suspended']);
        }
    }
}

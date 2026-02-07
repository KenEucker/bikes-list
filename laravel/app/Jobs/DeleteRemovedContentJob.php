<?php

namespace App\Jobs;

use App\Models\CommunityPage;
use App\Models\Flag;
use App\Models\Ride;
use App\Models\Sale;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class DeleteRemovedContentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $retentionDays = config('moderation.removed_content_retention_days', 60);
        $cutoff = now()->subDays($retentionDays);

        $this->deleteRemovedSales($cutoff);
        $this->deleteRemovedRides($cutoff);
        $this->deleteRemovedCommunityPages($cutoff);
    }

    private function deleteRemovedSales($cutoff): void
    {
        $sales = Sale::query()
            ->where('state', Sale::STATE_REMOVED)
            ->where('updated_at', '<=', $cutoff)
            ->get();

        foreach ($sales as $sale) {
            Flag::query()
                ->where('flaggable_type', Sale::class)
                ->where('flaggable_id', $sale->id)
                ->delete();
            $sale->delete();
            Log::info('Moderation cleanup: permanently deleted removed sale', ['sale_id' => $sale->id]);
        }
    }

    private function deleteRemovedRides($cutoff): void
    {
        $rides = Ride::query()
            ->where('state', Ride::STATE_REMOVED)
            ->where('updated_at', '<=', $cutoff)
            ->get();

        foreach ($rides as $ride) {
            Flag::query()
                ->where('flaggable_type', Ride::class)
                ->where('flaggable_id', $ride->id)
                ->delete();
            $ride->delete();
            Log::info('Moderation cleanup: permanently deleted removed ride', ['ride_id' => $ride->id]);
        }
    }

    private function deleteRemovedCommunityPages($cutoff): void
    {
        $pages = CommunityPage::query()
            ->where('state', CommunityPage::STATE_REMOVED)
            ->where('updated_at', '<=', $cutoff)
            ->get();

        foreach ($pages as $page) {
            Flag::query()
                ->where('flaggable_type', CommunityPage::class)
                ->where('flaggable_id', $page->id)
                ->delete();
            $page->delete();
            Log::info('Moderation cleanup: permanently deleted removed community page', ['community_page_id' => $page->id]);
        }
    }
}

<?php

namespace App\Services;

use App\Domain\Sales\Sale;
use Meilisearch\Client as MeilisearchClient;

class SearchService
{
    protected MeilisearchClient $client;
    protected string $indexName = 'sales';

    public function __construct()
    {
        $this->client = new MeilisearchClient(
            config('services.meilisearch.host', 'http://meilisearch:7700'),
            config('services.meilisearch.key', 'masterKey')
        );
    }

    /**
     * Index a sale in Meilisearch.
     */
    public function indexSale(Sale $sale): void
    {
        if ($sale->status !== 'active' || !$sale->published_at) {
            return;
        }

        $thumbImage = $sale->images()
            ->where('variant', 'thumb')
            ->first();

        $document = [
            'id' => $sale->id,
            'sale_id' => $sale->id,
            'region_slug' => $sale->region->slug,
            'title' => $sale->title,
            'description' => $sale->description,
            'price_cents' => $sale->price_cents,
            'category' => $sale->category,
            'condition' => $sale->condition,
            'published_at' => $sale->published_at->timestamp,
            'image_thumb_url' => $thumbImage?->cdn_url,
        ];

        $this->client->index($this->indexName)->addDocuments([$document]);
    }

    /**
     * Remove a sale from the index.
     */
    public function removeSale(int $saleId): void
    {
        $this->client->index($this->indexName)->deleteDocument($saleId);
    }

    /**
     * Search for-sale items.
     */
    public function search(string $query, ?string $regionSlug = null, array $filters = []): array
    {
        $index = $this->client->index($this->indexName);

        $searchParams = [
            'q' => $query,
            'limit' => $filters['limit'] ?? 20,
            'offset' => $filters['offset'] ?? 0,
        ];

        if ($regionSlug) {
            $searchParams['filter'] = "region_slug = '{$regionSlug}'";
        }

        $results = $index->search($query, $searchParams);

        return $results->getHits();
    }
}

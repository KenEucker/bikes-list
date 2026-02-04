<?php

namespace App\Services;

use App\Domain\Listings\Listing;
use Meilisearch\Client as MeilisearchClient;

class SearchService
{
    protected MeilisearchClient $client;
    protected string $indexName = 'listings';

    public function __construct()
    {
        $this->client = new MeilisearchClient(
            config('services.meilisearch.host', 'http://meilisearch:7700'),
            config('services.meilisearch.key', 'masterKey')
        );
    }

    /**
     * Index a listing in Meilisearch.
     */
    public function indexListing(Listing $listing): void
    {
        if ($listing->status !== 'active' || !$listing->published_at) {
            return;
        }

        $thumbImage = $listing->images()
            ->where('variant', 'thumb')
            ->first();

        $document = [
            'id' => $listing->id,
            'listing_id' => $listing->id,
            'region_slug' => $listing->region->slug,
            'title' => $listing->title,
            'description' => $listing->description,
            'price_cents' => $listing->price_cents,
            'category' => $listing->category,
            'condition' => $listing->condition,
            'published_at' => $listing->published_at->timestamp,
            'image_thumb_url' => $thumbImage?->cdn_url,
        ];

        $this->client->index($this->indexName)->addDocuments([$document]);
    }

    /**
     * Remove a listing from the index.
     */
    public function removeListing(int $listingId): void
    {
        $this->client->index($this->indexName)->deleteDocument($listingId);
    }

    /**
     * Search listings.
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

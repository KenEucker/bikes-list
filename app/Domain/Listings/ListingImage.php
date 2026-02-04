<?php

namespace App\Domain\Listings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id',
        'storage_key',
        'cdn_url',
        'width',
        'height',
        'mime',
        'variant',
    ];

    protected $casts = [
        'width' => 'integer',
        'height' => 'integer',
    ];

    /**
     * Get the listing that owns the image.
     */
    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    /**
     * Get the URL for the image.
     */
    public function getUrlAttribute(): ?string
    {
        return $this->cdn_url ?? null;
    }
}

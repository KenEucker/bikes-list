<?php

namespace App\Domain\Sales;

use App\Domain\Auth\User;
use App\Domain\Regions\Region;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'region_id',
        'user_id',
        'title',
        'description',
        'price_cents',
        'currency',
        'category',
        'condition',
        'brand',
        'model',
        'frame_size',
        'status',
        'published_at',
    ];

    protected $casts = [
        'price_cents' => 'integer',
        'published_at' => 'datetime',
    ];

    /**
     * Get the region that owns the sale.
     */
    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    /**
     * Get the user that owns the sale.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the images for the sale.
     */
    public function images(): HasMany
    {
        return $this->hasMany(SaleImage::class);
    }

    /**
     * Scope a query to only include sales for a specific region.
     */
    public function scopeForRegion($query, $regionId)
    {
        return $query->where('region_id', $regionId);
    }

    /**
     * Scope a query to only include active sales.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include published sales.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'active')
            ->whereNotNull('published_at');
    }

    /**
     * Get the formatted price.
     */
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price_cents / 100, 2) . ' ' . $this->currency;
    }
}

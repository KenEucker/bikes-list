<?php

namespace App\Domain\Sales;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SaleImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
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
     * Get the sale that owns the image.
     */
    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    /**
     * Get the URL for the image.
     */
    public function getUrlAttribute(): ?string
    {
        return $this->cdn_url ?? null;
    }
}

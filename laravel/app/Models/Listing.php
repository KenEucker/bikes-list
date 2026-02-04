<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Laravel\Scout\Searchable;
use Orchid\Attachment\Attachable;
use Orchid\Screen\AsSource;

class Listing extends Model
{
    use AsSource, Attachable, Searchable;

    protected $fillable = [
        'user_id',
        'city_id',
        'community_page_id',
        'type',
        'title',
        'description',
        'price',
        'state',
        'location_address',
        'location_lat',
        'location_lng',
        'attributes',
        'published_at',
        'expires_at',
    ];

    protected $casts = [
        'attributes' => 'array',
        'price' => 'decimal:2',
        'location_lat' => 'decimal:8',
        'location_lng' => 'decimal:8',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public const STATE_DRAFT = 'draft';
    public const STATE_PUBLISHED = 'published';
    public const STATE_SOLD = 'sold';
    public const STATE_EXPIRED = 'expired';
    public const STATE_REMOVED = 'removed';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function communityPage(): BelongsTo
    {
        return $this->belongsTo(CommunityPage::class, 'community_page_id');
    }

    public function relayAddress(): HasOne
    {
        return $this->hasOne(ListingRelayAddress::class);
    }

    public function flags(): MorphMany
    {
        return $this->morphMany(Flag::class, 'flaggable');
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'city_id' => $this->city_id,
            'type' => $this->type,
            'state' => $this->state,
            'price' => $this->price?->toFloat(),
            'published_at' => $this->published_at?->toIso8601String(),
        ];
    }

    public function shouldBeSearchable(): bool
    {
        return $this->state === self::STATE_PUBLISHED;
    }
}

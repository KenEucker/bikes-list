<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Laravel\Scout\Searchable;
use Orchid\Attachment\Attachable;
use Orchid\Screen\AsSource;

class Sale extends Model
{
    use AsSource, Attachable, Searchable;

    protected $table = 'sales';

    protected $fillable = [
        'user_id',
        'city_id',
        'community_page_id',
        'type',
        'title',
        'description',
        'price',
        'condition',
        'state',
        'location_address',
        'location_lat',
        'location_lng',
        'attributes',
        'serial_number',
        'serial_private',
        'published_at',
        'expires_at',
    ];

    protected $casts = [
        'attributes' => 'array',
        'price' => 'decimal:2',
        'serial_private' => 'boolean',
        'location_lat' => 'decimal:8',
        'location_lng' => 'decimal:8',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public const STATE_DRAFT = 'draft';
    public const STATE_PENDING_REVIEW = 'pending_review';
    public const STATE_PUBLISHED = 'published';
    public const STATE_SOLD = 'sold';
    public const STATE_EXPIRED = 'expired';
    public const STATE_REMOVED = 'removed';

    public const CONDITION_NEW = 'new';
    public const CONDITION_LIKE_NEW = 'like_new';
    public const CONDITION_GOOD = 'good';
    public const CONDITION_FAIR = 'fair';
    public const CONDITION_POOR = 'poor';

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
        return $this->hasOne(SaleRelayAddress::class);
    }

    public function flags(): MorphMany
    {
        return $this->morphMany(Flag::class, 'flaggable');
    }

    public function uploads(): MorphToMany
    {
        return $this->morphToMany(Upload::class, 'uploadable', 'uploadables')
            ->withPivot('position')
            ->orderByPivot('position');
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

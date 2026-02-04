<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;
use Orchid\Screen\AsSource;

class Event extends Model
{
    use AsSource, Searchable;

    protected $fillable = [
        'user_id',
        'city_id',
        'community_page_id',
        'title',
        'description',
        'organizer_name',
        'organizer_email',
        'organizer_email_hidden',
        'state',
        'location_address',
        'location_lat',
        'location_lng',
        'route_description',
        'starts_at',
        'ends_at',
        'timezone',
        'is_recurring',
        'recurrence_ends_at',
        'recurrence_rule',
        'tags',
        'published_at',
        'submitted_at',
        'guidelines_accepted_at',
    ];

    protected $casts = [
        'organizer_email_hidden' => 'boolean',
        'is_recurring' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'recurrence_ends_at' => 'datetime',
        'recurrence_rule' => 'array',
        'tags' => 'array',
        'published_at' => 'datetime',
        'submitted_at' => 'datetime',
        'guidelines_accepted_at' => 'datetime',
        'location_lat' => 'decimal:8',
        'location_lng' => 'decimal:8',
    ];

    public const STATE_DRAFT = 'draft';
    public const STATE_PENDING_REVIEW = 'pending_review';
    public const STATE_PUBLISHED = 'published';
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

    public function guidelineAcceptances(): BelongsToMany
    {
        return $this->belongsToMany(Guideline::class, 'event_guideline_acceptances')
            ->withPivot('accepted_at')
            ->withTimestamps();
    }

    public function associatedCommunityPages(): BelongsToMany
    {
        return $this->belongsToMany(CommunityPage::class, 'event_community_page');
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'city_id' => $this->city_id,
            'state' => $this->state,
            'starts_at' => $this->starts_at?->toIso8601String(),
            'ends_at' => $this->ends_at?->toIso8601String(),
        ];
    }

    public function shouldBeSearchable(): bool
    {
        return $this->state === self::STATE_PUBLISHED;
    }
}

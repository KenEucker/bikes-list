<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Orchid\Screen\AsSource;

class CommunityPage extends Model
{
    use AsSource;

    protected $fillable = [
        'type',
        'city_id',
        'name',
        'slug',
        'about',
        'event_info',
        'sales_info',
        'contact_address',
        'contact_email',
        'contact_phone',
        'contact_lat',
        'contact_lng',
        'state',
        'featured',
        'created_by_user_id',
        'claimed_by_user_id',
    ];

    protected $casts = [
        'contact_lat' => 'decimal:8',
        'contact_lng' => 'decimal:8',
        'featured' => 'boolean',
    ];

    public const TYPE_BIKE_SHOP = 'bike_shop';
    public const TYPE_CLUB = 'club';
    public const TYPE_RECURRING_EVENT = 'recurring_event';
    public const TYPE_TEAM = 'team';
    public const TYPE_ADVOCACY_ORG = 'advocacy_org';
    public const TYPE_CO_OP = 'co_op';
    public const TYPE_INFORMAL_GROUP = 'informal_group';

    public const STATE_PENDING = 'pending';
    public const STATE_APPROVED = 'approved';
    public const STATE_REMOVED = 'removed';

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function claimedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'claimed_by_user_id');
    }

    public function managers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'community_page_managers')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class, 'community_page_id');
    }

    public function claims(): HasMany
    {
        return $this->hasMany(CommunityPageClaim::class, 'community_page_id');
    }

    public function rides(): BelongsToMany
    {
        return $this->belongsToMany(Ride::class, 'ride_community_page');
    }

    public function uploads(): MorphToMany
    {
        return $this->morphToMany(Upload::class, 'uploadable', 'uploadables')
            ->withPivot('position')
            ->orderByPivot('position');
    }
}

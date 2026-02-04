<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Orchid\Screen\AsSource;

class CommunityPage extends Model
{
    use AsSource;

    protected $fillable = [
        'type',
        'city_id',
        'name',
        'about',
        'event_info',
        'sales_info',
        'contact_address',
        'contact_email',
        'contact_phone',
        'contact_lat',
        'contact_lng',
        'state',
        'created_by_user_id',
        'claimed_by_user_id',
    ];

    protected $casts = [
        'contact_lat' => 'decimal:8',
        'contact_lng' => 'decimal:8',
    ];

    public const TYPE_BIKE_SHOP = 'bike_shop';
    public const TYPE_CLUB = 'club';
    public const TYPE_RECURRING_EVENT = 'recurring_event';

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

    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class, 'community_page_id');
    }

    public function claims(): HasMany
    {
        return $this->hasMany(CommunityPageClaim::class, 'community_page_id');
    }

    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class, 'event_community_page');
    }
}

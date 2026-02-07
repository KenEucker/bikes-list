<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Orchid\Filters\Types\Like;
use Orchid\Filters\Types\Where;
use Orchid\Filters\Types\WhereDateStartEnd;
use Orchid\Platform\Models\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'permissions',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'permissions'          => 'array',
        'email_verified_at'    => 'datetime',
    ];

    /**
     * The attributes for which you can use filters in url.
     *
     * @var array
     */
    protected $allowedFilters = [
           'id'         => Where::class,
           'name'       => Like::class,
           'email'      => Like::class,
           'updated_at' => WhereDateStartEnd::class,
           'created_at' => WhereDateStartEnd::class,
    ];

    /**
     * The attributes for which can use sort in url.
     *
     * @var array
     */
    protected $allowedSorts = [
        'id',
        'name',
        'email',
        'updated_at',
        'created_at',
    ];

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function savedSearches(): HasMany
    {
        return $this->hasMany(SavedSearch::class);
    }

    public function flags(): HasMany
    {
        return $this->hasMany(Flag::class);
    }

    public function moderatedCities(): BelongsToMany
    {
        return $this->belongsToMany(City::class, 'city_user')
            ->wherePivotNotNull('city_id')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function isGlobalModerator(): bool
    {
        return DB::table('city_user')
            ->where('user_id', $this->id)
            ->whereNull('city_id')
            ->where('role', 'global')
            ->exists();
    }

    public function canModerateCity(City $city): bool
    {
        if ($this->isGlobalModerator()) {
            return true;
        }
        return $this->moderatedCities()->where('cities.id', $city->id)->exists();
    }

    public function managedCommunityPages(): BelongsToMany
    {
        return $this->belongsToMany(CommunityPage::class, 'community_page_managers')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function rides(): HasMany
    {
        return $this->hasMany(Ride::class);
    }

    public function isEstablished(): bool
    {
        if ($this->created_at->diffInDays(now(), false) >= 7) {
            return true;
        }
        return $this->sales()->where('state', Sale::STATE_PUBLISHED)->exists()
            || $this->rides()->where('state', Ride::STATE_PUBLISHED)->exists()
            || $this->managedCommunityPages()->where('community_pages.state', CommunityPage::STATE_APPROVED)->exists();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Orchid\Screen\AsSource;

class City extends Model
{
    use AsSource;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'latitude',
        'longitude',
        'state_province',
        'country',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function savedSearches(): HasMany
    {
        return $this->hasMany(SavedSearch::class);
    }

    public function guidelines(): HasMany
    {
        return $this->hasMany(Guideline::class);
    }

    public function communityPages(): HasMany
    {
        return $this->hasMany(CommunityPage::class);
    }

    public function rides(): HasMany
    {
        return $this->hasMany(Ride::class);
    }

    public function moderators(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'city_user')
            ->withPivot('role')
            ->withTimestamps();
    }
}

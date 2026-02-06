<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Orchid\Screen\AsSource;

class EventAudience extends Model
{
    use AsSource;

    protected $fillable = [
        'name',
        'sort_order',
        'city_id',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class, 'audience_id');
    }

    /**
     * Global audiences (city_id null) plus audiences for the given city.
     */
    public function scopeForCity(Builder $query, ?int $cityId): Builder
    {
        return $query->where(function (Builder $q) use ($cityId) {
            $q->whereNull('city_id');
            if ($cityId !== null) {
                $q->orWhere('city_id', $cityId);
            }
        })->orderBy('sort_order')->orderBy('name');
    }
}

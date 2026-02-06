<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Orchid\Screen\AsSource;

class EventTag extends Model
{
    use AsSource;

    protected $fillable = [
        'slug',
        'label',
        'city_id',
    ];

    /**
     * Global tags (city_id null) plus tags for the given city.
     */
    public function scopeForCity(Builder $query, ?int $cityId): Builder
    {
        return $query->where(function (Builder $q) use ($cityId) {
            $q->whereNull('city_id');
            if ($cityId !== null) {
                $q->orWhere('city_id', $cityId);
            }
        })->orderBy('label');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}

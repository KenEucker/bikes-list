<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Orchid\Screen\AsSource;

class Guideline extends Model
{
    use AsSource;

    protected $fillable = ['name', 'body', 'published_at', 'scope', 'city_id', 'archived_at'];

    protected $casts = [
        'published_at' => 'datetime',
        'archived_at' => 'datetime',
    ];

    public const SCOPE_SITEWIDE = 'sitewide';
    public const SCOPE_CITY = 'city';

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function scopeActive($query)
    {
        return $query->whereNull('archived_at');
    }

    public function scopeSitewide($query)
    {
        return $query->where('scope', self::SCOPE_SITEWIDE);
    }

    public function scopeForCity($query, ?int $cityId)
    {
        if ($cityId === null) {
            return $query->where('scope', self::SCOPE_SITEWIDE);
        }
        return $query->where(function ($q) use ($cityId) {
            $q->where('scope', self::SCOPE_SITEWIDE)
                ->orWhere(function ($q2) use ($cityId) {
                    $q2->where('scope', self::SCOPE_CITY)->where('city_id', $cityId);
                });
        });
    }
}

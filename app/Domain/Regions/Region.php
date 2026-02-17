<?php

namespace App\Domain\Regions;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'timezone',
        'is_active',
        'settings',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'settings' => 'array',
    ];

    /**
     * Scope a query to only include active regions.
     */
    public function scopeIsActive($query)
    {
        return $query->where('is_active', true);
    }
}

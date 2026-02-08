<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $primaryKey = 'key';

    protected $fillable = [
        'key',
        'value',
        'type',
        'created_by',
        'updated_by',
    ];

    protected static function booted(): void
    {
        static::saved(function (): void {
            self::clearOverridesCache();
        });

        static::deleted(function (): void {
            self::clearOverridesCache();
        });
    }

    public static function clearOverridesCache(): void
    {
        Cache::forget(config('settings.cache_key', 'settings.overrides'));
    }

    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}

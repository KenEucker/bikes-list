<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Str;

class Upload extends Model
{
    public const STATUS_PROCESSING = 'processing';

    public const STATUS_READY = 'ready';

    public const STATUS_FAILED = 'failed';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'resource_type',
        'resource_id',
        'mime_original',
        'width',
        'height',
        'variants',
        'visibility',
        'status',
        'temp_key',
        'created_by',
    ];

    protected $casts = [
        'variants' => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (Upload $upload): void {
            if (empty($upload->id)) {
                $upload->id = (string) Str::uuid();
            }
        });
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function listings(): MorphToMany
    {
        return $this->morphedByMany(Listing::class, 'uploadable', 'uploadables')
            ->withPivot('position');
    }

    public function events(): MorphToMany
    {
        return $this->morphedByMany(Event::class, 'uploadable', 'uploadables')
            ->withPivot('position');
    }

    public function communityPages(): MorphToMany
    {
        return $this->morphedByMany(CommunityPage::class, 'uploadable', 'uploadables')
            ->withPivot('position');
    }

    /**
     * Resolve public URL for a variant (sm, md, lg). Uses UploadStorageService via app container.
     */
    public function urlForVariant(string $variant): ?string
    {
        return app(\App\Services\UploadStorageService::class)->urlForVariant($this, $variant);
    }
}

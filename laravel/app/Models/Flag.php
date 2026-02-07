<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Flag extends Model
{
    protected $fillable = ['flaggable_type', 'flaggable_id', 'user_id', 'session_id', 'reason'];

    public function flaggable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Whether this flag was submitted by an authenticated user. */
    public function isFromGuest(): bool
    {
        return $this->user_id === null;
    }
}

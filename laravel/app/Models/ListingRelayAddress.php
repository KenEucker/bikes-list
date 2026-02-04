<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ListingRelayAddress extends Model
{
    protected $fillable = ['listing_id', 'token'];

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public static function generateToken(): string
    {
        return Str::random(32);
    }
}

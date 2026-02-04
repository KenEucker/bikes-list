<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ListingRelayThread extends Model
{
    protected $fillable = ['listing_id', 'sender_email_hash', 'reply_to_token'];

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public static function hashSenderEmail(string $email): string
    {
        return hash('sha256', strtolower($email));
    }

    public static function generateReplyToToken(): string
    {
        return Str::random(24);
    }
}

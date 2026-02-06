<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class SaleRelayThread extends Model
{
    protected $table = 'sale_relay_threads';

    protected $fillable = ['sale_id', 'sender_email_hash', 'reply_to_token'];

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
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

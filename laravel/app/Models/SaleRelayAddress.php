<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class SaleRelayAddress extends Model
{
    protected $table = 'sale_relay_addresses';

    protected $fillable = ['sale_id', 'token'];

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public static function generateToken(): string
    {
        return Str::random(32);
    }
}

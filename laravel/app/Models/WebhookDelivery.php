<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Orchid\Screen\AsSource;

class WebhookDelivery extends Model
{
    use AsSource;
    protected $fillable = [
        'webhook_endpoint_id',
        'event_name',
        'payload',
        'response_status',
        'response_body',
        'attempt',
        'delivered_at',
        'failed_at',
        'error_message',
    ];

    protected $casts = [
        'payload' => 'array',
        'delivered_at' => 'datetime',
        'failed_at' => 'datetime',
    ];

    public function endpoint(): BelongsTo
    {
        return $this->belongsTo(WebhookEndpoint::class, 'webhook_endpoint_id');
    }
}

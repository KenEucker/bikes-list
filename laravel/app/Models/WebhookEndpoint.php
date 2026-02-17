<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Orchid\Screen\AsSource;

class WebhookEndpoint extends Model
{
    use AsSource;
    protected $fillable = [
        'user_id',
        'url',
        'secret',
        'name',
        'template',
        'events',
        'is_active',
        'failure_count',
        'last_triggered_at',
    ];

    protected $casts = [
        'events' => 'array',
        'secret' => 'encrypted',
        'is_active' => 'boolean',
        'last_triggered_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function deliveries(): HasMany
    {
        return $this->hasMany(WebhookDelivery::class, 'webhook_endpoint_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeSubscribedTo(Builder $query, string $event): Builder
    {
        return $query->whereJsonContains('events', $event);
    }

    public function subscribesTo(string $event): bool
    {
        return in_array($event, $this->events ?? [], true);
    }

    public function recordFailure(): void
    {
        $this->increment('failure_count');
        $threshold = config('webhooks.auto_disable_threshold', 10);
        if ($this->failure_count >= $threshold) {
            $this->update(['is_active' => false]);
        }
    }

    public function resetFailures(): void
    {
        $this->update(['failure_count' => 0]);
    }
}

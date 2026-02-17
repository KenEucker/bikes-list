<?php

namespace App\Webhooks\Payloads;

use App\Models\Ride;

class RidePayload
{
    public static function fromModel(Ride $ride): array
    {
        $ride->loadMissing('city');
        $region = $ride->city?->slug ?? '';
        $baseUrl = rtrim(config('app.url'), '/');
        $url = $region ? "{$baseUrl}/{$region}/rides/{$ride->id}" : "{$baseUrl}/rides/{$ride->id}";

        return [
            'id' => $ride->id,
            'name' => $ride->name,
            'state' => $ride->state,
            'region' => $region,
            'starts_at' => $ride->starts_at?->toIso8601String(),
            'ends_at' => $ride->ends_at?->toIso8601String(),
            'url' => $url,
            'created_at' => $ride->created_at?->toIso8601String(),
        ];
    }
}

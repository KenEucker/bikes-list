<?php

namespace App\Webhooks\Payloads;

use App\Models\Sale;

class SalePayload
{
    public static function fromModel(Sale $sale): array
    {
        $sale->loadMissing('city');
        $region = $sale->city?->slug ?? '';
        $baseUrl = rtrim(config('app.url'), '/');
        $url = $region ? "{$baseUrl}/{$region}/for-sale/{$sale->id}" : "{$baseUrl}/for-sale/{$sale->id}";

        return [
            'id' => $sale->id,
            'title' => $sale->title,
            'type' => $sale->type,
            'price_cents' => $sale->price ? (int) round($sale->price * 100) : null,
            'currency' => 'USD',
            'state' => $sale->state,
            'region' => $region,
            'url' => $url,
            'created_at' => $sale->created_at?->toIso8601String(),
        ];
    }
}

<?php

return [
    'signing_algorithm' => 'sha256',
    'timeout_seconds' => (int) env('WEBHOOKS_TIMEOUT', 10),
    'max_retries' => (int) env('WEBHOOKS_MAX_RETRIES', 3),
    'backoff' => [30, 120, 600],
    'auto_disable_threshold' => (int) env('WEBHOOKS_AUTO_DISABLE_THRESHOLD', 10),
    'queue' => env('WEBHOOKS_QUEUE', 'webhooks'),
    'supported_events' => [
        'sale.created',
        'sale.updated',
        'sale.sold',
        'sale.deleted',
        'ride.created',
        'ride.updated',
        'ride.cancelled',
    ],
    'template_variables' => [
        'common' => ['event', 'timestamp', 'delivery_id'],
        'sale' => ['data.id', 'data.title', 'data.type', 'data.price_cents', 'data.currency', 'data.state', 'data.region', 'data.url', 'data.created_at'],
        'ride' => ['data.id', 'data.name', 'data.state', 'data.region', 'data.starts_at', 'data.ends_at', 'data.url', 'data.created_at'],
    ],
    'payload_max_size' => 65536,
];

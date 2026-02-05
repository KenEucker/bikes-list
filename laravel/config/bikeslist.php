<?php

return [
    'auto_publish_hours' => (int) env('BIKESLIST_AUTO_PUBLISH_HOURS', 48),
    'auto_approve_hours' => (int) env('BIKESLIST_AUTO_APPROVE_HOURS', 48),
    'bike_index_search_url' => env('BIKESLIST_BIKE_INDEX_URL', 'https://bikeindex.org/search'),
    'moderator_relay_email' => env('BIKESLIST_MODERATOR_RELAY_EMAIL', 'mods@' . (parse_url(config('app.url'), PHP_URL_HOST) ?: 'localhost')),
];

<?php

/**
 * Map ENV variable names to Laravel config keys.
 * Add entries here to make an env var mappable and overridable from the admin Settings screen.
 * Values can be a single config key (string) or an array of config keys.
 */
return [
    'APP_NAME' => 'app.name',
    'APP_ENV' => 'app.env',
    'APP_DEBUG' => 'app.debug',
    'APP_URL' => 'app.url',
    'APP_DOMAIN' => 'app.domain',
    'APP_LOCALE' => 'app.locale',
    'APP_FALLBACK_LOCALE' => 'app.fallback_locale',
    'APP_FAKER_LOCALE' => 'app.faker_locale',
    'APP_MAINTENANCE_DRIVER' => 'app.maintenance.driver',
    'APP_MAINTENANCE_STORE' => 'app.maintenance.store',

    'BIKESLIST_AUTO_PUBLISH_HOURS' => 'bikeslist.auto_publish_hours',
    'BIKESLIST_AUTO_APPROVE_HOURS' => 'bikeslist.auto_approve_hours',
    'BIKESLIST_BIKE_INDEX_URL' => 'bikeslist.bike_index_search_url',
    'BIKESLIST_MODERATOR_RELAY_EMAIL' => 'bikeslist.moderator_relay_email',

    'PLATFORM_PREFIX' => 'platform.prefix',
    'PLATFORM_DOMAIN' => 'platform.domain',
    'AUTH_GUARD' => 'platform.guard',
];

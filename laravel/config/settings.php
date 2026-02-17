<?php

return [
    /*
    |--------------------------------------------------------------------------
    | .env.example path
    |--------------------------------------------------------------------------
    | Path to the .env.example file used as the catalog of settings in the admin UI.
    */
    'env_example_path' => base_path('.env.example'),

    /*
    |--------------------------------------------------------------------------
    | Secret key detection (denylist)
    |--------------------------------------------------------------------------
    | Env var names containing any of these substrings (case-insensitive) are
    | treated as secret and hidden by default in the Settings UI.
    | Tune via secret_allowlist to force-show specific keys.
    */
    'secret_denylist_substrings' => [
        'KEY',
        'TOKEN',
        'SECRET',
        'PASSWORD',
        'PASS',
        'PRIVATE',
        'JWT',
        'OAUTH',
        'SIGNING',
        'CREDENTIAL',
        'CLIENT_SECRET',
    ],

    /*
    |--------------------------------------------------------------------------
    | Secret key allowlist
    |--------------------------------------------------------------------------
    | Env keys in this list are never treated as secret (override denylist).
    | Use for keys like APP_KEY that you want visible in admin for debugging.
    */
    'secret_allowlist' => [],

    /*
    |--------------------------------------------------------------------------
    | Settings overrides cache
    |--------------------------------------------------------------------------
    */
    'cache_key' => 'settings.overrides',
    'cache_ttl' => 3600,
];

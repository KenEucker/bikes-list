<?php

/*
|--------------------------------------------------------------------------
| Resolve an OAuth redirect URI against APP_URL when the value is a
| relative path.  This ensures the redirect always points to the main
| domain (not a city subdomain) and uses the correct scheme, so only
| one callback URL needs to be registered per provider.
|--------------------------------------------------------------------------
*/
$resolveRedirect = function (string $envKey, string $default): string {
    $uri = env($envKey, $default);

    return str_starts_with($uri, '/')
        ? rtrim(env('APP_URL', 'http://localhost'), '/') . $uri
        : $uri;
};

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id'     => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect'      => $resolveRedirect('GOOGLE_REDIRECT_URI', '/auth/google/callback'),
    ],

    'discord' => [
        'client_id'     => env('DISCORD_CLIENT_ID'),
        'client_secret' => env('DISCORD_CLIENT_SECRET'),
        'redirect'      => $resolveRedirect('DISCORD_REDIRECT_URI', '/auth/discord/callback'),
    ],

];

<?php

use App\Http\Middleware\CorrelationId;
use App\Http\Middleware\ResolveRegion;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function ($router) {
            // Orchid routes are registered via OrchidRouteServiceProvider
            // Custom platform routes can be loaded here if needed
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            CorrelationId::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

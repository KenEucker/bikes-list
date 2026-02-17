<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Middleware\EnsureRuntime;
use Illuminate\Support\Facades\Route;

// Admin routes (only accessible when APP_RUNTIME=admin)
// Orchid routes are registered via OrchidRouteServiceProvider
// Custom admin routes can be added here

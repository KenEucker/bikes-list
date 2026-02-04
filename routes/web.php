<?php

use App\Http\Controllers\Consumer\LandingController;
use App\Http\Controllers\Consumer\RegionHomeController;
use App\Http\Controllers\Consumer\ListingController;
use App\Http\Controllers\Consumer\MagicLinkController;
use App\Http\Middleware\ResolveRegion;
use Illuminate\Support\Facades\Route;

// Landing page (bikeslist.org)
Route::domain('bikeslist.org')->group(function () {
    Route::get('/', [LandingController::class, 'index'])->name('landing');
    Route::get('/regions', [LandingController::class, 'regions'])->name('regions.index');
});

// Region subdomains (*.bikeslist.org)
Route::domain('{subdomain}.bikeslist.org')->middleware([ResolveRegion::class])->group(function () {
    Route::get('/', [RegionHomeController::class, 'index'])->name('region.home');
    Route::get('/listings/{listing}', [ListingController::class, 'show'])->name('listings.show');
    Route::get('/listings/create', [ListingController::class, 'create'])->middleware('auth:web')->name('listings.create');
    Route::post('/listings', [ListingController::class, 'store'])->middleware('auth:web')->name('listings.store');
    Route::get('/my-listings', [ListingController::class, 'myListings'])->middleware('auth:web')->name('listings.my');
});

// Magic link routes (consumer)
Route::post('/magic-link/request', [MagicLinkController::class, 'request'])->name('magic-link.request');
Route::get('/magic-link/verify/{token}', [MagicLinkController::class, 'verify'])->name('magic-link.verify');

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Consumer\ImageUploadController;
use App\Domain\Listings\Listing;

Route::prefix('v1')->group(function () {
    // Region-scoped listings
    Route::get('/regions/{region}/listings', function (Request $request, string $region) {
        // Implementation will be added
        return response()->json(['message' => 'Listings endpoint']);
    })->name('api.v1.regions.listings');

    // Listing detail
    Route::get('/listings/{listing}', function (Request $request, Listing $listing) {
        return response()->json($listing->load(['images', 'user', 'region']));
    })->name('api.v1.listings.show');

    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/listings', function (Request $request) {
            // Implementation will be added
            return response()->json(['message' => 'Create listing endpoint']);
        })->name('api.v1.listings.store');

        Route::get('/my-listings', function (Request $request) {
            // Implementation will be added
            return response()->json(['message' => 'My listings endpoint']);
        })->name('api.v1.listings.my');

        // Image upload routes
        Route::post('/listings/{listing}/images/upload-url', [ImageUploadController::class, 'generateUploadUrl'])
            ->name('api.v1.listings.images.upload-url');
        Route::post('/listings/{listing}/images', [ImageUploadController::class, 'store'])
            ->name('api.v1.listings.images.store');
    });
});

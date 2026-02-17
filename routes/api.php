<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Consumer\ImageUploadController;
use App\Domain\Sales\Sale;

Route::prefix('v1')->group(function () {
    // Region-scoped for-sale
    Route::get('/regions/{region}/for-sale', function (Request $request, string $region) {
        // Implementation will be added
        return response()->json(['message' => 'For Sale endpoint']);
    })->name('api.v1.regions.for-sale');

    // Sale detail
    Route::get('/for-sale/{sale}', function (Request $request, Sale $sale) {
        return response()->json($sale->load(['images', 'user', 'region']));
    })->name('api.v1.for-sale.show');

    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/for-sale', function (Request $request) {
            // Implementation will be added
            return response()->json(['message' => 'Create sale endpoint']);
        })->name('api.v1.for-sale.store');

        Route::get('/my-for-sale', function (Request $request) {
            // Implementation will be added
            return response()->json(['message' => 'My for sale endpoint']);
        })->name('api.v1.for-sale.my');

        // Image upload routes
        Route::post('/for-sale/{sale}/images/upload-url', [ImageUploadController::class, 'generateUploadUrl'])
            ->name('api.v1.for-sale.images.upload-url');
        Route::post('/for-sale/{sale}/images', [ImageUploadController::class, 'store'])
            ->name('api.v1.for-sale.images.store');
    });
});

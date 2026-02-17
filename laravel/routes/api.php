<?php

use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'throttle:uploads'])->group(function () {
    Route::post('/uploads/sign', [UploadController::class, 'sign']);
    Route::post('/uploads/complete', [UploadController::class, 'complete']);
    Route::post('/uploads', [UploadController::class, 'store']);
});

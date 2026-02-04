<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SavedSearchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::get('account/sign-in', [AuthenticatedSessionController::class, 'create'])->name('account.sign-in');
    Route::post('account/sign-in', [AuthenticatedSessionController::class, 'store']);
    Route::get('account/sign-up', [RegisteredUserController::class, 'create'])->name('account.sign-up');
    Route::post('account/sign-up', [RegisteredUserController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::get('account/settings', [ProfileController::class, 'edit'])->name('account.settings');
    Route::patch('account/settings', [ProfileController::class, 'update'])->name('account.settings.update');
    Route::delete('account/settings', [ProfileController::class, 'destroy'])->name('account.settings.destroy');
    Route::get('account/magic-link', function () {
        return Inertia::render('Account/MagicLink');
    })->name('account.magic-link');
    Route::get('account/saved-searches', [SavedSearchController::class, 'index'])->name('saved-searches.index');
    Route::post('account/saved-searches', [SavedSearchController::class, 'store'])->name('saved-searches.store');
    Route::put('account/saved-searches/{savedSearch}', [SavedSearchController::class, 'update'])->name('saved-searches.update');
    Route::delete('account/saved-searches/{savedSearch}', [SavedSearchController::class, 'destroy'])->name('saved-searches.destroy');
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])->name('password.confirm');
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);
    Route::put('password', [PasswordController::class, 'update'])->name('password.update');
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

// Password reset (guest)
Route::middleware('guest')->group(function () {
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
});

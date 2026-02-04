<?php

use App\Http\Controllers\CityController;
use App\Http\Controllers\CommunityPageClaimController;
use App\Http\Controllers\CommunityPageController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FlagController;
use App\Http\Controllers\InboundRelayController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SavedSearchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Inbound email relay (webhook from Mailgun/Postmark etc.; configure CSRF exemption or use auth in production)
Route::post('/relay/inbound', InboundRelayController::class)->name('relay.inbound');

// City subdomains (e.g. austin.localhost)
Route::domain('{city}.localhost')->group(function () {
    Route::get('/', [CityController::class, 'show'])->name('city.show');

    Route::get('/listings', [ListingController::class, 'index'])->name('city.listings.index');
    Route::get('/listings/create', [ListingController::class, 'create'])->name('city.listings.create')->middleware(['auth', 'verified']);
    Route::post('/listings', [ListingController::class, 'store'])->name('city.listings.store')->middleware(['auth', 'verified']);
    Route::get('/listings/{listing}', [ListingController::class, 'show'])->name('city.listings.show');
    Route::get('/listings/{listing}/edit', [ListingController::class, 'edit'])->name('city.listings.edit')->middleware(['auth', 'verified']);
    Route::put('/listings/{listing}', [ListingController::class, 'update'])->name('city.listings.update')->middleware(['auth', 'verified']);
    Route::delete('/listings/{listing}', [ListingController::class, 'destroy'])->name('city.listings.destroy')->middleware(['auth', 'verified']);
    Route::post('/listings/{listing}/publish', [ListingController::class, 'publish'])->name('city.listings.publish')->middleware(['auth', 'verified']);
    Route::post('/listings/{listing}/sold', [ListingController::class, 'markSold'])->name('city.listings.sold')->middleware(['auth', 'verified']);
    Route::post('/listings/{listing}/flag', [FlagController::class, 'store'])->name('city.listings.flag')->middleware(['auth', 'verified']);

    Route::get('/events', [EventController::class, 'index'])->name('city.events.index');
    Route::get('/events/create', [EventController::class, 'create'])->name('city.events.create')->middleware(['auth', 'verified']);
    Route::post('/events', [EventController::class, 'store'])->name('city.events.store')->middleware(['auth', 'verified']);
    Route::get('/events/{event}', [EventController::class, 'show'])->name('city.events.show');
    Route::get('/events/{event}/edit', [EventController::class, 'edit'])->name('city.events.edit')->middleware(['auth', 'verified']);
    Route::put('/events/{event}', [EventController::class, 'update'])->name('city.events.update')->middleware(['auth', 'verified']);

    Route::get('/community', [CommunityPageController::class, 'index'])->name('city.community-pages.index');
    Route::get('/community/create', [CommunityPageController::class, 'create'])->name('city.community-pages.create')->middleware(['auth', 'verified']);
    Route::post('/community', [CommunityPageController::class, 'store'])->name('city.community-pages.store')->middleware(['auth', 'verified']);
    Route::get('/community/{communityPage}', [CommunityPageController::class, 'show'])->name('city.community-pages.show');
    Route::get('/community/{communityPage}/edit', [CommunityPageController::class, 'edit'])->name('city.community-pages.edit')->middleware(['auth', 'verified']);
    Route::put('/community/{communityPage}', [CommunityPageController::class, 'update'])->name('city.community-pages.update')->middleware(['auth', 'verified']);
    Route::get('/community/{communityPage}/claim', [CommunityPageClaimController::class, 'create'])->name('city.community-pages.claim')->middleware(['auth', 'verified']);
    Route::post('/community/{communityPage}/claim', [CommunityPageClaimController::class, 'store'])->name('city.community-pages.claim.store')->middleware(['auth', 'verified']);
});

// Main domain: frontend
Route::get('/', [CityController::class, 'index'])->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/profile/saved-searches', [SavedSearchController::class, 'index'])->name('saved-searches.index');
    Route::post('/profile/saved-searches', [SavedSearchController::class, 'store'])->name('saved-searches.store');
    Route::put('/profile/saved-searches/{savedSearch}', [SavedSearchController::class, 'update'])->name('saved-searches.update');
    Route::delete('/profile/saved-searches/{savedSearch}', [SavedSearchController::class, 'destroy'])->name('saved-searches.destroy');
});

require __DIR__.'/auth.php';

<?php

use App\Http\Controllers\CityController;
use App\Http\Controllers\CommunityPageClaimController;
use App\Http\Controllers\CommunityPageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FlagController;
use App\Http\Controllers\InboundRelayController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\ModerationActionController;
use App\Http\Controllers\ModerationController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::post('/relay/inbound', InboundRelayController::class)->name('relay.inbound');

$cityRoutes = function () {
    Route::get('/', [CityController::class, 'show'])->name('city.show');
    Route::get('/search', [SearchController::class, 'index'])->name('city.search');

    Route::get('/listings', [ListingController::class, 'index'])->name('city.listings.index');
    Route::get('/listings/new', [ListingController::class, 'create'])->name('city.listings.create')->middleware(['auth', 'verified']);
    Route::post('/listings', [ListingController::class, 'store'])->name('city.listings.store')->middleware(['auth', 'verified']);
    Route::get('/listings/{listing}', [ListingController::class, 'show'])->name('city.listings.show');
    Route::get('/listings/{listing}/edit', [ListingController::class, 'edit'])->name('city.listings.edit')->middleware(['auth', 'verified']);
    Route::put('/listings/{listing}', [ListingController::class, 'update'])->name('city.listings.update')->middleware(['auth', 'verified']);
    Route::delete('/listings/{listing}', [ListingController::class, 'destroy'])->name('city.listings.destroy')->middleware(['auth', 'verified']);
    Route::post('/listings/{listing}/publish', [ListingController::class, 'publish'])->name('city.listings.publish')->middleware(['auth', 'verified']);
    Route::post('/listings/{listing}/sold', [ListingController::class, 'markSold'])->name('city.listings.sold')->middleware(['auth', 'verified']);
    Route::post('/listings/{listing}/flag', [FlagController::class, 'store'])->name('city.listings.flag')->middleware(['auth', 'verified']);

    Route::get('/events', [EventController::class, 'index'])->name('city.events.index');
    Route::get('/events/new', [EventController::class, 'create'])->name('city.events.create')->middleware(['auth', 'verified']);
    Route::post('/events', [EventController::class, 'store'])->name('city.events.store')->middleware(['auth', 'verified']);
    Route::get('/events/{event}', [EventController::class, 'show'])->name('city.events.show');
    Route::get('/events/{event}/edit', [EventController::class, 'edit'])->name('city.events.edit')->middleware(['auth', 'verified']);
    Route::put('/events/{event}', [EventController::class, 'update'])->name('city.events.update')->middleware(['auth', 'verified']);

    Route::get('/community', [CommunityPageController::class, 'index'])->name('city.community-pages.index');
    Route::get('/community/new', [CommunityPageController::class, 'create'])->name('city.community-pages.create')->middleware(['auth', 'verified']);
    Route::post('/community', [CommunityPageController::class, 'store'])->name('city.community-pages.store')->middleware(['auth', 'verified']);
    Route::get('/community/{slug}', [CommunityPageController::class, 'show'])->name('city.community-pages.show');
    Route::get('/community/{slug}/edit', [CommunityPageController::class, 'edit'])->name('city.community-pages.edit')->middleware(['auth', 'verified']);
    Route::put('/community/{slug}', [CommunityPageController::class, 'update'])->name('city.community-pages.update')->middleware(['auth', 'verified']);
    Route::get('/community/{slug}/claim', [CommunityPageClaimController::class, 'create'])->name('city.community-pages.claim')->middleware(['auth', 'verified']);
    Route::post('/community/{slug}/claim', [CommunityPageClaimController::class, 'store'])->name('city.community-pages.claim.store')->middleware(['auth', 'verified']);

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('city.dashboard');
        Route::get('/dashboard/listings', [DashboardController::class, 'listings'])->name('city.dashboard.listings');
        Route::get('/dashboard/events', [DashboardController::class, 'events'])->name('city.dashboard.events');
        Route::get('/dashboard/pending', [DashboardController::class, 'pending'])->name('city.dashboard.pending');
        Route::get('/dashboard/pages', [DashboardController::class, 'pages'])->name('city.dashboard.pages');
        Route::get('/dashboard/pages/{slug}', [DashboardController::class, 'pageShow'])->name('city.dashboard.pages.show');
    });

    Route::middleware(['auth', 'verified', \App\Http\Middleware\EnsureCityModerator::class])->prefix('moderation')->name('city.moderation.')->group(function () {
        Route::get('/', [ModerationController::class, 'index'])->name('index');
        Route::get('/listings', [ModerationController::class, 'listings'])->name('listings');
        Route::post('/listings/{listing}/approve', [ModerationActionController::class, 'approveListing'])->name('listings.approve');
        Route::post('/listings/{listing}/remove', [ModerationActionController::class, 'removeListing'])->name('listings.remove');
        Route::get('/events', [ModerationController::class, 'events'])->name('events');
        Route::post('/events/{event}/approve', [ModerationActionController::class, 'approveEvent'])->name('events.approve');
        Route::post('/events/{event}/remove', [ModerationActionController::class, 'removeEvent'])->name('events.remove');
        Route::get('/pages', [ModerationController::class, 'pages'])->name('pages');
        Route::post('/pages/{page}/approve', [ModerationActionController::class, 'approvePage'])->name('pages.approve');
        Route::post('/pages/{page}/remove', [ModerationActionController::class, 'removePage'])->name('pages.remove');
    });
};

Route::domain('{city}.localhost')->group($cityRoutes);
$appHost = parse_url(config('app.url'), PHP_URL_HOST);
if ($appHost && $appHost !== 'localhost') {
    Route::domain('{city}.' . $appHost)->group($cityRoutes);
}

Route::get('/', [CityController::class, 'index'])->name('home');
Route::get('/dashboard', function () {
    return redirect('/');
})->name('dashboard');
Route::get('/terms', [LegalController::class, 'terms'])->name('terms');
Route::get('/privacy', [LegalController::class, 'privacy'])->name('privacy');

require __DIR__ . '/account.php';

Route::get('/auth/google/callback', function () {
    return redirect('/')->with('status', 'Google login not configured.');
})->name('auth.google.callback');
Route::get('/auth/discord/callback', function () {
    return redirect('/')->with('status', 'Discord login not configured.');
})->name('auth.discord.callback');

require __DIR__ . '/auth.php';

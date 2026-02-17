<?php

use App\Http\Controllers\CityController;
use App\Http\Controllers\CommunityPageClaimController;
use App\Http\Controllers\CommunityPageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RideController;
use App\Http\Controllers\FlagController;
use App\Http\Controllers\InboundRelayController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\ModerationActionController;
use App\Http\Controllers\ModerationController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\StreamUploadController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::post('/relay/inbound', InboundRelayController::class)->name('relay.inbound');

// Serve upload images on any domain so frontend and backend (Orchid) can load them
Route::get('/uploads/{id}/{filename}', StreamUploadController::class)
    ->where('filename', 'lg\.webp|sm\.webp|md\.webp')
    ->name('uploads.stream');

$cityRoutes = function () {
    Route::get('/', [CityController::class, 'show'])->name('city.show');
    Route::get('/search', [SearchController::class, 'index'])->name('city.search');

    Route::get('/for-sale', [SaleController::class, 'index'])->name('city.sales.index');
    Route::get('/for-sale/new', [SaleController::class, 'create'])->name('city.sales.create');
    Route::post('/for-sale', [SaleController::class, 'store'])->name('city.sales.store');
    Route::get('/for-sale/{sale}', [SaleController::class, 'show'])->name('city.sales.show');
    Route::get('/for-sale/{sale}/edit', [SaleController::class, 'edit'])->name('city.sales.edit')->middleware(['auth', 'verified']);
    Route::put('/for-sale/{sale}', [SaleController::class, 'update'])->name('city.sales.update')->middleware(['auth', 'verified']);
    Route::delete('/for-sale/{sale}', [SaleController::class, 'destroy'])->name('city.sales.destroy')->middleware(['auth', 'verified']);
    Route::post('/for-sale/{sale}/publish', [SaleController::class, 'publish'])->name('city.sales.publish')->middleware(['auth', 'verified']);
    Route::post('/for-sale/{sale}/sold', [SaleController::class, 'markSold'])->name('city.sales.sold')->middleware(['auth', 'verified']);
    Route::post('/for-sale/{sale}/flag', [FlagController::class, 'store'])->name('city.sales.flag');

    Route::get('/rides', [RideController::class, 'index'])->name('city.rides.index');
    Route::get('/rides/new', [RideController::class, 'create'])->name('city.rides.create');
    Route::post('/rides', [RideController::class, 'store'])->name('city.rides.store');
    Route::get('/rides/{ride}', [RideController::class, 'show'])->name('city.rides.show');
    Route::get('/rides/{ride}/edit', [RideController::class, 'edit'])->name('city.rides.edit')->middleware(['auth', 'verified']);
    Route::put('/rides/{ride}', [RideController::class, 'update'])->name('city.rides.update')->middleware(['auth', 'verified']);

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
        Route::get('/dashboard/sales', [DashboardController::class, 'sales'])->name('city.dashboard.sales');
        Route::get('/dashboard/rides', [DashboardController::class, 'rides'])->name('city.dashboard.rides');
        Route::get('/dashboard/pending', [DashboardController::class, 'pending'])->name('city.dashboard.pending');
        Route::get('/dashboard/pages', [DashboardController::class, 'pages'])->name('city.dashboard.pages');
        Route::get('/dashboard/pages/{slug}', [DashboardController::class, 'pageShow'])->name('city.dashboard.pages.show');
    });

    Route::middleware(['auth', 'verified', \App\Http\Middleware\EnsureCityModerator::class])->prefix('moderation')->name('city.moderation.')->group(function () {
        Route::get('/', [ModerationController::class, 'index'])->name('index');
        Route::get('/sales', [ModerationController::class, 'sales'])->name('sales');
        Route::post('/sales/{sale}/approve', [ModerationActionController::class, 'approveSale'])->name('sales.approve');
        Route::post('/sales/{sale}/revert', [ModerationActionController::class, 'revertSale'])->name('sales.revert');
        Route::post('/sales/{sale}/remove', [ModerationActionController::class, 'removeSale'])->name('sales.remove');
        Route::get('/rides', [ModerationController::class, 'rides'])->name('rides');
        Route::post('/rides/{ride}/approve', [ModerationActionController::class, 'approveRide'])->name('rides.approve');
        Route::post('/rides/{ride}/revert', [ModerationActionController::class, 'revertRide'])->name('rides.revert');
        Route::post('/rides/{ride}/remove', [ModerationActionController::class, 'removeRide'])->name('rides.remove');
        Route::get('/pages', [ModerationController::class, 'pages'])->name('pages');
        Route::post('/pages/{page}/approve', [ModerationActionController::class, 'approvePage'])->name('pages.approve');
        Route::post('/pages/{page}/revert', [ModerationActionController::class, 'revertPage'])->name('pages.revert');
        Route::post('/pages/{page}/remove', [ModerationActionController::class, 'removePage'])->name('pages.remove');
        Route::get('/claims', [ModerationController::class, 'claims'])->name('claims');
        Route::post('/claims/{claim}/approve', [ModerationActionController::class, 'approveClaim'])->name('claims.approve');
        Route::post('/claims/{claim}/reject', [ModerationActionController::class, 'rejectClaim'])->name('claims.reject');
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

Route::middleware('guest')->group(function () {
    Route::get('/auth/{provider}/redirect', [\App\Http\Controllers\Auth\SocialLoginController::class, 'redirect'])
        ->where('provider', 'google|discord')
        ->name('auth.social.redirect');
});
Route::get('/auth/{provider}/callback', [\App\Http\Controllers\Auth\SocialLoginController::class, 'callback'])
    ->where('provider', 'google|discord')
    ->name('auth.social.callback');

require __DIR__ . '/auth.php';

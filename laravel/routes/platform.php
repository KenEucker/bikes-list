<?php

declare(strict_types=1);

use App\Orchid\Screens\City\CityEditScreen;
use App\Orchid\Screens\City\CityListScreen;
use App\Orchid\Screens\CommunityPage\ClaimListScreen;
use App\Orchid\Screens\CommunityPage\CommunityPageCreateScreen;
use App\Orchid\Screens\CommunityPage\CommunityPageEditScreen;
use App\Orchid\Screens\CommunityPage\CommunityPageListScreen;
use App\Orchid\Screens\Ride\RideEditScreen;
use App\Orchid\Screens\Ride\RideListScreen;
use App\Orchid\Screens\RideAudience\RideAudienceEditScreen;
use App\Orchid\Screens\RideAudience\RideAudienceListScreen;
use App\Orchid\Screens\RideTag\RideTagEditScreen;
use App\Orchid\Screens\RideTag\RideTagListScreen;
use App\Orchid\Screens\Guideline\GuidelineEditScreen;
use App\Orchid\Screens\Guideline\GuidelineListScreen;
use App\Orchid\Screens\Sale\FlaggedSalesScreen;
use App\Orchid\Screens\Sale\SaleEditScreen;
use App\Orchid\Screens\Sale\SaleListScreen;
use App\Orchid\Screens\PlatformScreen;
use App\Orchid\Screens\Role\RoleEditScreen;
use App\Orchid\Screens\Role\RoleListScreen;
use App\Orchid\Screens\Upload\BucketStatusScreen;
use App\Orchid\Screens\Upload\UploadDetailScreen;
use App\Orchid\Screens\Upload\UploadListScreen;
use App\Orchid\Screens\User\UserEditScreen;
use App\Orchid\Screens\User\UserListScreen;
use App\Orchid\Screens\User\UserProfileScreen;
use Illuminate\Support\Facades\Route;
use Tabuna\Breadcrumbs\Trail;

// Main dashboard
Route::screen('/main', PlatformScreen::class)
    ->name('platform.main');

// Cities
Route::screen('cities/create', CityEditScreen::class)
    ->name('platform.systems.cities.create')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.systems.cities')
        ->push(__('Create'), route('platform.systems.cities.create')));

Route::screen('cities/{city}/edit', CityEditScreen::class)
    ->name('platform.systems.cities.edit')
    ->breadcrumbs(fn (Trail $trail, $city) => $trail
        ->parent('platform.systems.cities')
        ->push($city->name, route('platform.systems.cities.edit', $city)));

Route::screen('cities', CityListScreen::class)
    ->name('platform.systems.cities')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Cities'), route('platform.systems.cities')));

// Sales
Route::screen('sales', SaleListScreen::class)
    ->name('platform.systems.sales')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Sales'), route('platform.systems.sales')));

Route::screen('sales/{sale}/edit', SaleEditScreen::class)
    ->name('platform.systems.sales.edit')
    ->breadcrumbs(fn (Trail $trail, $sale) => $trail
        ->parent('platform.systems.sales')
        ->push($sale->title ?? __('Sale'), route('platform.systems.sales.edit', $sale)));

Route::screen('rides', RideListScreen::class)
    ->name('platform.systems.rides')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Rides'), route('platform.systems.rides')));

Route::screen('rides/{ride}/edit', RideEditScreen::class)
    ->name('platform.systems.rides.edit')
    ->breadcrumbs(fn (Trail $trail, $ride) => $trail
        ->parent('platform.systems.rides')
        ->push($ride->name ?? __('Ride'), route('platform.systems.rides.edit', $ride)));

// Ride audiences (admin)
Route::screen('ride-audiences/create', RideAudienceEditScreen::class)
    ->name('platform.systems.ride-audiences.create')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.systems.ride-audiences')
        ->push(__('Create'), route('platform.systems.ride-audiences.create')));

Route::screen('ride-audiences/{audience}/edit', RideAudienceEditScreen::class)
    ->name('platform.systems.ride-audiences.edit')
    ->breadcrumbs(fn (Trail $trail, $audience) => $trail
        ->parent('platform.systems.ride-audiences')
        ->push($audience->name ?? __('Audience'), route('platform.systems.ride-audiences.edit', $audience)));

Route::screen('ride-audiences', RideAudienceListScreen::class)
    ->name('platform.systems.ride-audiences')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Ride audiences'), route('platform.systems.ride-audiences')));

// Ride tags (admin)
Route::screen('ride-tags/create', RideTagEditScreen::class)
    ->name('platform.systems.ride-tags.create')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.systems.ride-tags')
        ->push(__('Create'), route('platform.systems.ride-tags.create')));

Route::screen('ride-tags/{tag}/edit', RideTagEditScreen::class)
    ->name('platform.systems.ride-tags.edit')
    ->breadcrumbs(fn (Trail $trail, $tag) => $trail
        ->parent('platform.systems.ride-tags')
        ->push($tag->label ?? __('Tag'), route('platform.systems.ride-tags.edit', $tag)));

Route::screen('ride-tags', RideTagListScreen::class)
    ->name('platform.systems.ride-tags')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Ride tags'), route('platform.systems.ride-tags')));

Route::screen('moderation/flagged-sales', FlaggedSalesScreen::class)
    ->name('platform.moderation.flagged')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Flagged sales'), route('platform.moderation.flagged')));

// Guidelines
Route::screen('guidelines/create', GuidelineEditScreen::class)
    ->name('platform.systems.guidelines.create')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.systems.guidelines')
        ->push(__('Create'), route('platform.systems.guidelines.create')));

Route::screen('guidelines/{guideline}/edit', GuidelineEditScreen::class)
    ->name('platform.systems.guidelines.edit')
    ->breadcrumbs(fn (Trail $trail, $guideline) => $trail
        ->parent('platform.systems.guidelines')
        ->push($guideline->name ?? __('Guideline'), route('platform.systems.guidelines.edit', $guideline)));

Route::screen('guidelines', GuidelineListScreen::class)
    ->name('platform.systems.guidelines')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Guidelines'), route('platform.systems.guidelines')));

Route::screen('community-pages/create', CommunityPageCreateScreen::class)
    ->name('platform.systems.community-pages.create')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.systems.community-pages')
        ->push(__('Create'), route('platform.systems.community-pages.create')));

Route::screen('community-pages/{communityPage}/edit', CommunityPageEditScreen::class)
    ->name('platform.systems.community-pages.edit')
    ->breadcrumbs(fn (Trail $trail, $communityPage) => $trail
        ->parent('platform.systems.community-pages')
        ->push($communityPage->name ?? __('Page'), route('platform.systems.community-pages.edit', $communityPage)));

Route::screen('community-pages', CommunityPageListScreen::class)
    ->name('platform.systems.community-pages')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Community pages'), route('platform.systems.community-pages')));

Route::screen('moderation/claims', ClaimListScreen::class)
    ->name('platform.moderation.claims')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Claim requests'), route('platform.moderation.claims')));

// Profile
Route::screen('profile', UserProfileScreen::class)
    ->name('platform.profile')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Profile'), route('platform.profile')));

// Users
Route::screen('users/{user}/edit', UserEditScreen::class)
    ->name('platform.systems.users.edit')
    ->breadcrumbs(fn (Trail $trail, $user) => $trail
        ->parent('platform.systems.users')
        ->push($user->name, route('platform.systems.users.edit', $user)));

Route::screen('users/create', UserEditScreen::class)
    ->name('platform.systems.users.create')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.systems.users')
        ->push(__('Create'), route('platform.systems.users.create')));

Route::screen('users', UserListScreen::class)
    ->name('platform.systems.users')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Users'), route('platform.systems.users')));

// Roles
Route::screen('roles/{role}/edit', RoleEditScreen::class)
    ->name('platform.systems.roles.edit')
    ->breadcrumbs(fn (Trail $trail, $role) => $trail
        ->parent('platform.systems.roles')
        ->push($role->name, route('platform.systems.roles.edit', $role)));

Route::screen('roles/create', RoleEditScreen::class)
    ->name('platform.systems.roles.create')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.systems.roles')
        ->push(__('Create'), route('platform.systems.roles.create')));

Route::screen('roles', RoleListScreen::class)
    ->name('platform.systems.roles')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Roles'), route('platform.systems.roles')));

// Uploads
Route::screen('uploads/bucket', BucketStatusScreen::class)
    ->name('platform.uploads.bucket')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Bucket status'), route('platform.uploads.bucket')));

Route::screen('uploads', UploadListScreen::class)
    ->name('platform.uploads.list')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Uploads'), route('platform.uploads.list')));

Route::screen('uploads/{upload}', UploadDetailScreen::class)
    ->name('platform.uploads.detail')
    ->breadcrumbs(fn (Trail $trail, $upload) => $trail
        ->parent('platform.uploads.list')
        ->push($upload->id ?? __('Upload'), route('platform.uploads.detail', $upload)));

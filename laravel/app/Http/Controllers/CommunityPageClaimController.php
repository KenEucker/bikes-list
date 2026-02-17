<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CommunityPage;
use App\Models\CommunityPageClaim;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunityPageClaimController extends Controller
{
    public function create(Request $request, string $citySlug, string $slug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $communityPage = CommunityPage::query()->where('city_id', $city->id)->where('slug', $slug)->firstOrFail();
        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);
        return Inertia::render('CommunityPages/Claim', [
            'city' => $city,
            'communityPage' => $communityPage,
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function store(Request $request, string $citySlug, string $slug): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $communityPage = CommunityPage::query()->where('city_id', $city->id)->where('slug', $slug)->firstOrFail();
        $request->validate(['message' => ['required', 'string', 'max:2000']]);
        CommunityPageClaim::create([
            'community_page_id' => $communityPage->id,
            'user_id' => $request->user()->id,
            'message' => $request->input('message'),
            'status' => CommunityPageClaim::STATUS_PENDING,
        ]);
        return back()->with('status', 'Claim request submitted. City moderators will review.');
    }
}

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
    public function create(Request $request, string $citySlug, CommunityPage $communityPage): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($communityPage->city_id !== $city->id) {
            abort(404);
        }
        $cityBaseUrl = $request->getScheme() . '://' . $citySlug . '.' . $request->getHost() . ($request->getPort() && !in_array($request->getPort(), [80, 443]) ? ':' . $request->getPort() : '');
        return Inertia::render('CommunityPages/Claim', [
            'city' => $city,
            'communityPage' => $communityPage,
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function store(Request $request, string $citySlug, CommunityPage $communityPage): \Illuminate\Http\RedirectResponse
    {
        $city = \App\Models\City::query()->where('slug', $citySlug)->firstOrFail();
        if ($communityPage->city_id !== $city->id) {
            abort(404);
        }
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

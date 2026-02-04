<?php

namespace App\Http\Controllers\Consumer;

use App\Domain\Listings\Listing;
use App\Domain\Regions\CurrentRegion;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function show($id, CurrentRegion $currentRegion)
    {
        $region = $currentRegion->require();
        
        $listing = Listing::forRegion($region->id)
            ->with(['images', 'user'])
            ->findOrFail($id);

        return inertia('ListingDetail', [
            'listing' => $listing,
        ]);
    }

    public function create(CurrentRegion $currentRegion)
    {
        $region = $currentRegion->require();
        
        return inertia('CreateListing', [
            'region' => $region,
        ]);
    }

    public function store(Request $request, CurrentRegion $currentRegion)
    {
        $region = $currentRegion->require();
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price_cents' => 'required|integer|min:0',
            'currency' => 'required|string|size:3',
            'category' => 'nullable|string',
            'condition' => 'nullable|string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'frame_size' => 'nullable|string',
        ]);

        $listing = Listing::create([
            'region_id' => $region->id,
            'user_id' => auth()->id(),
            'status' => 'draft',
            ...$validated,
        ]);

        return redirect()->route('listings.show', $listing->id);
    }

    public function myListings(CurrentRegion $currentRegion)
    {
        $region = $currentRegion->require();
        
        $listings = Listing::where('user_id', auth()->id())
            ->forRegion($region->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return inertia('MyListings', [
            'region' => $region,
            'listings' => $listings,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Consumer;

use App\Domain\Listings\Listing;
use App\Domain\Listings\ListingImage;
use App\Jobs\GenerateListingImageVariantsJob;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    /**
     * Generate a signed upload URL for direct client upload to Spaces.
     */
    public function generateUploadUrl(Request $request, Listing $listing)
    {
        // Check authorization
        if ($request->user()->id !== $listing->user_id) {
            abort(403, 'Unauthorized');
        }

        $filename = Str::uuid() . '.jpg';
        $key = "listings/{$listing->id}/{$filename}";

        $disk = Storage::disk('spaces');
        $url = $disk->temporaryUploadUrl($key, now()->addMinutes(10));

        return response()->json([
            'upload_url' => $url,
            'key' => $key,
            'expires_at' => now()->addMinutes(10)->toIso8601String(),
        ]);
    }

    /**
     * Record an uploaded image after client uploads directly to Spaces.
     */
    public function store(Request $request, Listing $listing)
    {
        // Check authorization
        if ($request->user()->id !== $listing->user_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'storage_key' => 'required|string',
            'width' => 'nullable|integer',
            'height' => 'nullable|integer',
            'mime' => 'nullable|string',
        ]);

        $disk = Storage::disk('spaces');
        $cdnUrl = $disk->url($validated['storage_key']);

        $listingImage = ListingImage::create([
            'listing_id' => $listing->id,
            'storage_key' => $validated['storage_key'],
            'cdn_url' => $cdnUrl,
            'width' => $validated['width'] ?? null,
            'height' => $validated['height'] ?? null,
            'mime' => $validated['mime'] ?? 'image/jpeg',
            'variant' => 'original',
        ]);

        // Dispatch job to generate variants
        GenerateListingImageVariantsJob::dispatch($listingImage->id);

        return response()->json([
            'image' => $listingImage,
        ]);
    }
}

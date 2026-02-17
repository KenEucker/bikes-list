<?php

namespace App\Http\Controllers\Consumer;

use App\Domain\Sales\Sale;
use App\Domain\Sales\SaleImage;
use App\Jobs\GenerateSaleImageVariantsJob;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    /**
     * Generate a signed upload URL for direct client upload to Spaces.
     */
    public function generateUploadUrl(Request $request, Sale $sale)
    {
        // Check authorization
        if ($request->user()->id !== $sale->user_id) {
            abort(403, 'Unauthorized');
        }

        $filename = Str::uuid() . '.jpg';
        $key = "sales/{$sale->id}/{$filename}";

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
    public function store(Request $request, Sale $sale)
    {
        // Check authorization
        if ($request->user()->id !== $sale->user_id) {
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

        $saleImage = SaleImage::create([
            'sale_id' => $sale->id,
            'storage_key' => $validated['storage_key'],
            'cdn_url' => $cdnUrl,
            'width' => $validated['width'] ?? null,
            'height' => $validated['height'] ?? null,
            'mime' => $validated['mime'] ?? 'image/jpeg',
            'variant' => 'original',
        ]);

        // Dispatch job to generate variants
        GenerateSaleImageVariantsJob::dispatch($saleImage->id);

        return response()->json([
            'image' => $saleImage,
        ]);
    }
}

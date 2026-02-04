<?php

namespace App\Jobs;

use App\Domain\Listings\ListingImage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class GenerateListingImageVariantsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $listingImageId
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $listingImage = ListingImage::find($this->listingImageId);

        if (!$listingImage || $listingImage->variant !== 'original') {
            return;
        }

        $disk = Storage::disk('spaces');
        $manager = new ImageManager(new Driver());

        // Download original from Spaces
        $originalContent = $disk->get($listingImage->storage_key);
        $image = $manager->read($originalContent);

        // Define variants
        $variants = [
            'large' => ['width' => 1200, 'height' => 1200],
            'medium' => ['width' => 800, 'height' => 800],
            'thumb' => ['width' => 400, 'height' => 400],
        ];

        foreach ($variants as $variantName => $dimensions) {
            // Resize image
            $resized = $image->scale(
                width: $dimensions['width'],
                height: $dimensions['height']
            );

            // Generate storage key for variant
            $pathInfo = pathinfo($listingImage->storage_key);
            $variantKey = $pathInfo['dirname'] . '/' . $pathInfo['filename'] . '_' . $variantName . '.' . $pathInfo['extension'];

            // Upload variant to Spaces
            $variantContent = (string) $resized->encode();
            $disk->put($variantKey, $variantContent, 'public');

            // Get CDN URL
            $cdnUrl = $disk->url($variantKey);

            // Create ListingImage record for variant
            ListingImage::create([
                'listing_id' => $listingImage->listing_id,
                'storage_key' => $variantKey,
                'cdn_url' => $cdnUrl,
                'width' => $dimensions['width'],
                'height' => $dimensions['height'],
                'mime' => $listingImage->mime,
                'variant' => $variantName,
            ]);
        }
    }
}

<?php

namespace App\Jobs;

use App\Domain\Sales\SaleImage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class GenerateSaleImageVariantsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $saleImageId
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $saleImage = SaleImage::find($this->saleImageId);

        if (!$saleImage || $saleImage->variant !== 'original') {
            return;
        }

        $disk = Storage::disk('spaces');
        $manager = new ImageManager(new Driver());

        // Download original from Spaces
        $originalContent = $disk->get($saleImage->storage_key);
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
            $pathInfo = pathinfo($saleImage->storage_key);
            $variantKey = $pathInfo['dirname'] . '/' . $pathInfo['filename'] . '_' . $variantName . '.' . $pathInfo['extension'];

            // Upload variant to Spaces
            $variantContent = (string) $resized->encode();
            $disk->put($variantKey, $variantContent, 'public');

            // Get CDN URL
            $cdnUrl = $disk->url($variantKey);

            // Create SaleImage record for variant
            SaleImage::create([
                'sale_id' => $saleImage->sale_id,
                'storage_key' => $variantKey,
                'cdn_url' => $cdnUrl,
                'width' => $dimensions['width'],
                'height' => $dimensions['height'],
                'mime' => $saleImage->mime,
                'variant' => $variantName,
            ]);
        }
    }
}

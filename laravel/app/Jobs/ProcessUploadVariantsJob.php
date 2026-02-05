<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Upload;
use App\Services\UploadImageValidator;
use App\Services\UploadStorageService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

use const IMAGETYPE_BMP;
use const IMAGETYPE_JPEG;
use const IMAGETYPE_PNG;
use const IMAGETYPE_WEBP;
use function getimagesize;
use function imagealphablending;
use function imagecopyresampled;
use function imagecreatefrombmp;
use function imagecreatefromjpeg;
use function imagecreatefrompng;
use function imagecreatefromwebp;
use function imagecreatetruecolor;
use function imagedestroy;
use function imagesavealpha;
use function imagesx;
use function imagesy;
use function imagewebp;
use function unlink;

class ProcessUploadVariantsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public const VARIANT_WIDTHS = [
        'sm' => 240,
        'md' => 520,
        'lg' => 720,
    ];

    public const WEBP_QUALITY = 82;

    public function __construct(
        public Upload $upload
    ) {}

    public function handle(UploadStorageService $storage, UploadImageValidator $validator): void
    {
        $upload = $this->upload->fresh();
        if (! $upload || $upload->status !== Upload::STATUS_PROCESSING) {
            return;
        }

        $tempKey = $upload->temp_key;
        if (! $tempKey) {
            $this->failUpload($upload, 'No temp key');
            return;
        }

        $disk = $storage->disk();
        if (! Storage::disk($disk)->exists($tempKey)) {
            $this->failUpload($upload, 'Temp object missing');
            return;
        }

        $localPath = tempnam(sys_get_temp_dir(), 'upload_');
        if ($localPath === false) {
            $this->failUpload($upload, 'Could not create temp file');
            return;
        }

        try {
            $contents = Storage::disk($disk)->get($tempKey);
            if ($contents === null) {
                throw new \RuntimeException('Could not read temp object');
            }
            file_put_contents($localPath, $contents);
        } catch (\Throwable $e) {
            @unlink($localPath);
            $this->failUpload($upload, $e->getMessage());
            return;
        }

        try {
            $validator->validatePath($localPath);
        } catch (\Illuminate\Validation\ValidationException $e) {
            @unlink($localPath);
            $this->failUpload($upload, implode(' ', $e->errors()['file'] ?? [$e->getMessage()]));
            return;
        }

        $image = $this->loadImage($localPath);
        if ($image === false) {
            @unlink($localPath);
            $this->failUpload($upload, 'Unsupported image format');
            return;
        }

        $width = imagesx($image);
        $height = imagesy($image);
        $resource = $upload->resource_type ?? 'uploads';
        $resourceId = $upload->resource_id ?? $upload->id;
        $variants = [];
        $lgWidth = 0;
        $lgHeight = 0;

        foreach (self::VARIANT_WIDTHS as $name => $targetWidth) {
            if ($width <= 0) {
                imagedestroy($image);
                @unlink($localPath);
                $this->failUpload($upload, 'Invalid dimensions');
                return;
            }
            $scale = min(1.0, $targetWidth / $width);
            $newWidth = (int) round($width * $scale);
            $newHeight = (int) round($height * $scale);
            if ($newWidth < 1) {
                $newWidth = 1;
            }
            if ($newHeight < 1) {
                $newHeight = 1;
            }

            $scaled = imagecreatetruecolor($newWidth, $newHeight);
            if ($scaled === false) {
                imagedestroy($image);
                @unlink($localPath);
                $this->failUpload($upload, 'Could not create variant');
                return;
            }
            imagecopyresampled($scaled, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

            ob_start();
            imagewebp($scaled, null, self::WEBP_QUALITY);
            $webpContents = ob_get_clean();
            imagedestroy($scaled);

            if ($webpContents === false || $webpContents === '') {
                imagedestroy($image);
                @unlink($localPath);
                $this->failUpload($upload, 'WebP encoding failed');
                return;
            }

            $key = $storage->keyForVariant($resource, $resourceId, $upload->id, $name);
            if (! Storage::disk($disk)->exists($key)) {
                Storage::disk($disk)->put($key, $webpContents, [
                    'CacheControl' => 'public, max-age=31536000, immutable',
                ]);
            }
            $variants[$name] = $key;
            if ($name === 'lg') {
                $lgWidth = $newWidth;
                $lgHeight = $newHeight;
            }
        }

        imagedestroy($image);
        @unlink($localPath);

        $upload->variants = $variants;
        $upload->width = $lgWidth;
        $upload->height = $lgHeight;
        $upload->status = Upload::STATUS_READY;
        $upload->temp_key = null;
        $upload->save();

        Storage::disk($disk)->delete($tempKey);

        Log::info('Upload variants ready', [
            'upload_id' => $upload->id,
            'resource_type' => $upload->resource_type,
            'resource_id' => $upload->resource_id,
        ]);
    }

    private function loadImage(string $path)
    {
        $info = @getimagesize($path);
        if ($info === false) {
            return false;
        }
        $image = false;
        switch ($info[2]) {
            case IMAGETYPE_JPEG:
                $image = @imagecreatefromjpeg($path);
                break;
            case IMAGETYPE_PNG:
                $image = @imagecreatefrompng($path);
                if ($image !== false) {
                    imagealphablending($image, true);
                    imagesavealpha($image, true);
                }
                break;
            case IMAGETYPE_BMP:
                $image = @imagecreatefrombmp($path);
                break;
            case IMAGETYPE_WEBP:
                $image = @imagecreatefromwebp($path);
                break;
        }

        return $image;
    }

    public function failed(?\Throwable $e): void
    {
        $upload = $this->upload->fresh();
        if ($upload && $upload->status === Upload::STATUS_PROCESSING) {
            $upload->status = Upload::STATUS_FAILED;
            $upload->save();
            Log::warning('Upload processing job failed', [
                'upload_id' => $upload->id,
                'exception' => $e?->getMessage(),
            ]);
        }
    }

    private function failUpload(Upload $upload, string $reason): void
    {
        $upload->status = Upload::STATUS_FAILED;
        // Keep temp_key so admin can retry; temp file is only deleted on success
        $upload->save();

        Log::warning('Upload processing failed', [
            'upload_id' => $upload->id,
            'reason' => $reason,
        ]);
    }
}

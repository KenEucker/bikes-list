<?php

namespace App\Http\Controllers;

use App\Models\Upload;
use App\Services\UploadStorageService;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Serves upload variant files (lg/sm/md.webp) at clean URLs: /uploads/{id}/{filename}.
 * Same-origin so img tags avoid ad-blocker and cross-origin issues.
 */
class StreamUploadController extends Controller
{
    private const ALLOWED_FILES = ['lg.webp', 'sm.webp', 'md.webp'];

    public function __invoke(string $id, string $filename): StreamedResponse
    {
        if (! in_array($filename, self::ALLOWED_FILES, true)) {
            abort(404);
        }

        $upload = Upload::find($id);
        if (! $upload || $upload->status !== Upload::STATUS_READY) {
            abort(404);
        }

        $variant = pathinfo($filename, PATHINFO_FILENAME); // lg, sm, md
        $storage = app(UploadStorageService::class);
        // Use the key stored at processing time (variants) so we find the file even after
        // resource_type/resource_id are updated when the upload is attached to a sale/ride/page.
        $key = is_array($upload->variants) && isset($upload->variants[$variant])
            ? $upload->variants[$variant]
            : $storage->getVariantKey($upload, $variant);

        if (! is_string($key) || $key === '') {
            abort(404);
        }

        $disk = $storage->disk();
        if (! Storage::disk($disk)->exists($key)) {
            abort(404);
        }

        return response()->streamDownload(
            function () use ($disk, $key) {
                $stream = Storage::disk($disk)->readStream($key);
                if (is_resource($stream)) {
                    fpassthru($stream);
                    fclose($stream);
                }
            },
            $filename,
            [
                'Content-Type' => 'image/webp',
                'Cache-Control' => 'public, max-age=31536000, immutable',
            ],
            'inline'
        );
    }
}

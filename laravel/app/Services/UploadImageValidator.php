<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UploadImageValidator
{
    public const MAX_BYTES = 10 * 1024 * 1024; // 10MB

    public const MAX_WIDTH = 8000;

    public const MAX_HEIGHT = 8000;

    /** @var array<string> */
    public const ALLOWED_MIMES = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/bmp',
        'image/webp',
    ];

    /**
     * Validate uploaded file: type by content sniff, size, dimensions, no animation.
     * @throws ValidationException
     */
    public function validate(UploadedFile $file): void
    {
        if ($file->getSize() > self::MAX_BYTES) {
            throw ValidationException::withMessages([
                'file' => ['File must not exceed 10MB.'],
            ]);
        }

        $path = $file->getRealPath();
        if ($path === false) {
            throw ValidationException::withMessages([
                'file' => ['Could not read uploaded file.'],
            ]);
        }

        $mime = $this->sniffMime($path);
        if ($mime === null || ! in_array(Str::lower($mime), array_map('strtolower', self::ALLOWED_MIMES), true)) {
            throw ValidationException::withMessages([
                'file' => ['Only static images are allowed (JPEG, PNG, BMP, WebP). Animated images are not supported.'],
            ]);
        }

        $this->rejectAnimated($path, $mime);

        $dimensions = @getimagesize($path);
        if ($dimensions !== false) {
            $w = $dimensions[0];
            $h = $dimensions[1];
            if ($w > self::MAX_WIDTH || $h > self::MAX_HEIGHT) {
                throw ValidationException::withMessages([
                    'file' => [sprintf('Image dimensions must not exceed %dx%d pixels.', self::MAX_WIDTH, self::MAX_HEIGHT)],
                ]);
            }
        }
    }

    /**
     * Validate from temp path (e.g. after reading from bucket in job).
     * @throws ValidationException
     */
    public function validatePath(string $path): void
    {
        if (! is_readable($path) || ! is_file($path)) {
            throw ValidationException::withMessages(['file' => ['Invalid or unreadable file.']]);
        }
        $size = filesize($path);
        if ($size > self::MAX_BYTES) {
            throw ValidationException::withMessages(['file' => ['File must not exceed 10MB.']]);
        }
        $mime = $this->sniffMime($path);
        if ($mime === null || ! in_array(Str::lower($mime), array_map('strtolower', self::ALLOWED_MIMES), true)) {
            throw ValidationException::withMessages([
                'file' => ['Only static images are allowed (JPEG, PNG, BMP, WebP).'],
            ]);
        }
        $this->rejectAnimated($path, $mime);
        $dimensions = @getimagesize($path);
        if ($dimensions !== false) {
            if ($dimensions[0] > self::MAX_WIDTH || $dimensions[1] > self::MAX_HEIGHT) {
                throw ValidationException::withMessages([
                    'file' => [sprintf('Image dimensions must not exceed %dx%d pixels.', self::MAX_WIDTH, self::MAX_HEIGHT)],
                ]);
            }
        }
    }

    private function sniffMime(string $path): ?string
    {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo === false) {
            return null;
        }
        $mime = finfo_file($finfo, $path);
        finfo_close($finfo);

        return $mime !== false ? $mime : null;
    }

    private function rejectAnimated(string $path, string $mime): void
    {
        $mime = Str::lower($mime);
        if ($mime === 'image/gif') {
            throw ValidationException::withMessages(['file' => ['Animated images are not supported.']]);
        }
        if ($mime === 'image/webp') {
            $data = @file_get_contents($path, false, null, 0, 32);
            if ($data !== false && str_contains($data, 'ANMF')) {
                throw ValidationException::withMessages(['file' => ['Animated WebP is not supported.']]);
            }
        }
    }
}

<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Upload;
use Aws\S3\S3Client;
use Illuminate\Support\Facades\Storage;

class UploadStorageService
{
    public function prefix(): string
    {
        return rtrim((string) env('UPLOADS_PREFIX', 'uploads'), '/');
    }

    public function disk(): string
    {
        return 'uploads';
    }

    /**
     * Build object key for a variant: {prefix}/{resource}/{resource-id}/{asset-id}/{variant}.webp
     */
    public function keyForVariant(string $resource, string|int $resourceId, string $assetId, string $variant): string
    {
        return sprintf(
            '%s/%s/%s/%s/%s.webp',
            $this->prefix(),
            $resource,
            $resourceId,
            $assetId,
            $variant
        );
    }

    /**
     * Temp key for client direct upload (before processing). Deleted after variant generation.
     */
    public function tempKey(string $uploadId): string
    {
        return $this->prefix() . '/tmp/' . $uploadId;
    }

    /**
     * Public path for a variant: /uploads/{id}/{variant}.webp. Return path only so
     * images load from the current host (frontend and backend), regardless of APP_URL.
     */
    public function urlForVariant(Upload $upload, string $variant): ?string
    {
        return '/uploads/' . $upload->id . '/' . $variant . '.webp';
    }

    /**
     * Get object key for an upload variant (for delete, exists check, etc.).
     */
    public function getVariantKey(Upload $upload, string $variant): string
    {
        $resource = $upload->resource_type ?? 'uploads';
        $resourceId = $upload->resource_id ?? $upload->id;

        return $this->keyForVariant($resource, $resourceId, $upload->id, $variant);
    }

    /**
     * All variant keys for an upload (sm, md, lg).
     *
     * @return array<string>
     */
    public function allVariantKeys(Upload $upload): array
    {
        $keys = [];
        foreach (['sm', 'md', 'lg'] as $v) {
            $keys[$v] = $this->getVariantKey($upload, $v);
        }

        return $keys;
    }

    /**
     * Idempotent write: skip if key already exists unless $force.
     */
    public function putIfMissing(string $key, string $contents, array $options = []): bool
    {
        if (Storage::disk($this->disk())->exists($key)) {
            return false;
        }

        $defaultOptions = [
            'CacheControl' => 'public, max-age=31536000, immutable',
        ];

        Storage::disk($this->disk())->put($key, $contents, array_merge($defaultOptions, $options));

        return true;
    }

    /**
     * Generate a presigned PUT URL for direct-to-bucket upload (e.g. tmp key).
     * Expires in 15 minutes by default.
     */
    public function signedPutUrl(string $key, \DateTimeInterface|string $expiresAt = '+15 minutes'): string
    {
        $config = config('filesystems.disks.uploads');
        $args = [
            'region' => $config['region'],
            'version' => 'latest',
            'credentials' => [
                'key' => $config['key'],
                'secret' => $config['secret'],
            ],
        ];
        if (! empty($config['endpoint'])) {
            $args['endpoint'] = $config['endpoint'];
            $args['use_path_style_endpoint'] = $config['use_path_style_endpoint'] ?? false;
        }
        $client = new S3Client($args);
        $cmd = $client->getCommand('PutObject', [
            'Bucket' => $config['bucket'],
            'Key' => $key,
        ]);
        $expiry = $expiresAt instanceof \DateTimeInterface
            ? $expiresAt
            : (new \DateTimeImmutable($expiresAt));
        $request = $client->createPresignedRequest($cmd, $expiry);

        return (string) $request->getUri();
    }
}

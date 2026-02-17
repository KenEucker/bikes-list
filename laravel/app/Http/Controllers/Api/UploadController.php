<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessUploadVariantsJob;
use App\Models\CommunityPage;
use App\Models\Ride;
use App\Models\Sale;
use App\Models\Upload;
use App\Services\UploadImageValidator;
use App\Services\UploadStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UploadController extends Controller
{
    public function __construct(
        private UploadStorageService $storage,
        private UploadImageValidator $validator
    ) {}

    /**
     * POST /api/uploads/sign - Get signed URL for direct-to-bucket upload.
     */
    public function sign(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'resource_type' => ['nullable', 'string', 'in:sales,rides,pages'],
            'resource_id' => ['nullable', 'string'],
        ]);

        $resourceType = $validated['resource_type'] ?? null;
        $resourceId = $validated['resource_id'] ?? null;
        if ($resourceType !== null && $resourceId !== null) {
            $this->authorizeResourceAttachment($request->user(), $resourceType, $resourceId);
        }

        $upload = Upload::create([
            'resource_type' => $resourceType,
            'resource_id' => $resourceId,
            'mime_original' => 'application/octet-stream',
            'visibility' => config('filesystems.disks.uploads.visibility', 'public'),
            'status' => Upload::STATUS_PROCESSING,
            'temp_key' => $this->storage->tempKey('pending'),
            'created_by' => $request->user()->id,
        ]);
        $upload->temp_key = $this->storage->tempKey($upload->id);
        $upload->save();

        $signedUrl = $this->storage->signedPutUrl($upload->temp_key);

        return response()->json([
            'upload_id' => $upload->id,
            'signed_url' => $signedUrl,
            'method' => 'PUT',
            'headers' => [
                'Content-Type' => 'application/octet-stream',
            ],
            'temp_key' => $upload->temp_key,
        ]);
    }

    /**
     * POST /api/uploads/complete - Called after client uploads to signed URL.
     */
    public function complete(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'upload_id' => ['required', 'uuid', 'exists:uploads,id'],
        ]);

        $upload = Upload::findOrFail($validated['upload_id']);
        if ($upload->created_by !== $request->user()->id) {
            abort(403, 'Not your upload.');
        }
        if ($upload->status !== Upload::STATUS_PROCESSING) {
            return response()->json(['upload' => $upload->fresh(), 'message' => 'Already processed.']);
        }

        if (! Storage::disk($this->storage->disk())->exists($upload->temp_key)) {
            abort(422, 'Temp object not found. Upload the file to the signed URL first.');
        }

        $processSync = filter_var(env('UPLOADS_PROCESS_SYNC', false), FILTER_VALIDATE_BOOLEAN);
        if ($processSync) {
            dispatch_sync(new ProcessUploadVariantsJob($upload));
        } else {
            dispatch(new ProcessUploadVariantsJob($upload));
        }

        return response()->json([
            'upload_id' => $upload->id,
            'status' => $upload->status,
            'message' => $processSync ? 'Processed.' : 'Processing started.',
        ]);
    }

    /**
     * POST /api/uploads - Multipart fallback upload.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file'],
        ]);

        $file = $request->file('file');
        if (! $file instanceof \Illuminate\Http\UploadedFile) {
            abort(422, 'Invalid file.');
        }

        try {
            $this->validator->validate($file);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage(), 'errors' => $e->errors()], 422);
        }

        $upload = Upload::create([
            'resource_type' => null,
            'resource_id' => null,
            'mime_original' => $file->getMimeType() ?: 'application/octet-stream',
            'visibility' => config('filesystems.disks.uploads.visibility', 'public'),
            'status' => Upload::STATUS_PROCESSING,
            'temp_key' => null,
            'created_by' => $request->user()->id,
        ]);
        $tempKey = $this->storage->tempKey($upload->id);
        $upload->temp_key = $tempKey;
        $upload->save();

        $contents = $file->get();
        Storage::disk($this->storage->disk())->put($tempKey, $contents);

        // Run processing immediately so uploads are ready without a queue worker
        dispatch_sync(new ProcessUploadVariantsJob($upload));

        return response()->json([
            'upload_id' => $upload->id,
            'status' => $upload->fresh()->status,
        ], 201);
    }

    private function authorizeResourceAttachment($user, string $resourceType, string $resourceId): void
    {
        $id = is_numeric($resourceId) ? (int) $resourceId : $resourceId;
        switch ($resourceType) {
            case 'sales':
                $sale = Sale::find($id);
                if (! $sale || $sale->user_id !== $user->id) {
                    abort(403, 'Cannot attach to this sale.');
                }
                break;
            case 'rides':
                $ride = Ride::find($id);
                if (! $ride || $ride->user_id !== $user->id) {
                    abort(403, 'Cannot attach to this ride.');
                }
                break;
            case 'pages':
                $page = CommunityPage::find($id);
                if (! $page) {
                    abort(403, 'Cannot attach to this page.');
                }
                $canManage = $user->managedCommunityPages()->where('community_pages.id', $page->id)->exists()
                    || $page->created_by_user_id === $user->id;
                if (! $canManage) {
                    abort(403, 'Cannot attach to this page.');
                }
                break;
        }
    }
}

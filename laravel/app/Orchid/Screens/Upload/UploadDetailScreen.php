<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Upload;

use App\Models\CommunityPage;
use App\Models\Event;
use App\Models\Listing;
use App\Models\Upload;
use App\Services\UploadStorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class UploadDetailScreen extends Screen
{
    public ?Upload $upload = null;

    public bool $canRetry = false;

    /** @var array<string, string|null> */
    public array $variantUrls = [];

    /** @var array<string, string> */
    public array $variantKeys = [];

    public ?string $resourceUrl = null;

    public ?string $resourceLabel = null;

    public function query(Upload $upload): iterable
    {
        $this->upload = $upload;
        $upload->load('createdBy');

        $storage = app(UploadStorageService::class);
        foreach (['sm', 'md', 'lg'] as $v) {
            $this->variantUrls[$v] = $upload->urlForVariant($v);
            $this->variantKeys[$v] = $storage->getVariantKey($upload, $v);
        }

        $this->resourceUrl = null;
        $this->resourceLabel = null;
        if ($upload->resource_type && $upload->resource_id) {
            $link = $this->resourceAdminLink($upload->resource_type, $upload->resource_id);
            if ($link) {
                $this->resourceUrl = $link['url'];
                $this->resourceLabel = $link['label'];
            }
        }

        $this->canRetry = $upload->status === Upload::STATUS_PROCESSING
            || ($upload->status === Upload::STATUS_FAILED
                && $upload->temp_key
                && Storage::disk($storage->disk())->exists($upload->temp_key));

        return [
            'upload' => $upload,
            'variant_urls' => $this->variantUrls,
            'variant_keys' => $this->variantKeys,
            'resource_url' => $this->resourceUrl,
            'resource_label' => $this->resourceLabel,
            'can_retry' => $this->canRetry,
        ];
    }

    public function name(): ?string
    {
        return __('Upload');
    }

    public function description(): ?string
    {
        return $this->upload?->id ?? __('Upload detail');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.uploads'];
    }

    public function commandBar(): iterable
    {
        $items = [
            Link::make(__('Back'))
                ->icon('bs.arrow-left')
                ->route('platform.uploads.list'),
        ];
        if ($this->canRetry) {
            $items[] = Button::make(__('Retry processing'))
                ->icon('bs.arrow-clockwise')
                ->method('retry');
        }
        $items[] = Button::make(__('Delete'))
            ->icon('bs.trash3')
            ->confirm(__('Delete this upload? This will remove objects from the bucket and unlink from any listings, events, or pages.'))
            ->method('delete');

        return $items;
    }

    public function layout(): iterable
    {
        return [
            Layout::view('orchid.upload-detail', [
                'upload' => $this->upload,
                'variant_urls' => $this->variantUrls,
                'variant_keys' => $this->variantKeys,
                'resource_url' => $this->resourceUrl,
                'resource_label' => $this->resourceLabel,
                'can_retry' => $this->canRetry,
            ]),
        ];
    }

    public function retry(Request $request, Upload $upload): \Illuminate\Http\RedirectResponse
    {
        $storage = app(UploadStorageService::class);
        $disk = $storage->disk();

        $tempKey = $upload->temp_key;
        if (! $tempKey && $upload->status === Upload::STATUS_FAILED) {
            $tempKey = $storage->tempKey($upload->id);
            if (Storage::disk($disk)->exists($tempKey)) {
                $upload->temp_key = $tempKey;
                $upload->save();
            }
        }

        $canRetry = $upload->status === Upload::STATUS_PROCESSING
            || ($upload->status === Upload::STATUS_FAILED
                && $upload->temp_key
                && Storage::disk($disk)->exists($upload->temp_key));
        if (! $canRetry) {
            Toast::warning(__('Cannot retry: temp file missing or already processed.'));
            return redirect()->route('platform.uploads.detail', $upload);
        }
        if ($upload->status === Upload::STATUS_FAILED) {
            $upload->status = Upload::STATUS_PROCESSING;
            $upload->save();
        }
        // Run synchronously so the result (success or error) is immediate without a queue worker
        try {
            $job = new \App\Jobs\ProcessUploadVariantsJob($upload);
            $job->handle(
                app(\App\Services\UploadStorageService::class),
                app(\App\Services\UploadImageValidator::class)
            );
            $upload->refresh();
            if ($upload->status === Upload::STATUS_READY) {
                Toast::success(__('Processing completed.'));
            } else {
                Toast::warning(__('Processing did not complete (check status).'));
            }
        } catch (\Throwable $e) {
            Toast::error(__('Processing failed: ') . $e->getMessage());
        }
        return redirect()->route('platform.uploads.detail', $upload);
    }

    public function delete(Request $request, Upload $upload): \Illuminate\Http\RedirectResponse
    {
        $storage = app(UploadStorageService::class);
        $disk = $storage->disk();
        $deleted = [];
        $missing = [];

        foreach (['sm', 'md', 'lg'] as $v) {
            $key = $storage->getVariantKey($upload, $v);
            if (Storage::disk($disk)->exists($key)) {
                Storage::disk($disk)->delete($key);
                $deleted[] = $key;
            } else {
                $missing[] = $key;
            }
        }
        if ($upload->temp_key && Storage::disk($disk)->exists($upload->temp_key)) {
            Storage::disk($disk)->delete($upload->temp_key);
            $deleted[] = $upload->temp_key;
        }

        $upload->listings()->detach();
        $upload->events()->detach();
        $upload->communityPages()->detach();
        $upload->delete();

        $msg = count($deleted) > 0 ? __('Upload deleted.') : __('Upload record deleted.');
        if (count($missing) > 0) {
            $msg .= ' ' . __('Some objects were already missing from the bucket.');
        }
        Toast::info($msg);

        return redirect()->route('platform.uploads.list');
    }

    /**
     * @return array{url: string, label: string}|null
     */
    private function resourceAdminLink(string $type, string $id): ?array
    {
        $url = null;
        $label = null;
        switch ($type) {
            case 'listings':
                $model = Listing::find($id);
                if ($model) {
                    $url = route('platform.systems.listings.edit', $model);
                    $label = $model->title ?? 'Listing #' . $id;
                }
                break;
            case 'events':
                $model = Event::find($id);
                if ($model) {
                    $url = route('platform.systems.events.edit', $model);
                    $label = $model->title ?? 'Event #' . $id;
                }
                break;
            case 'pages':
                $model = CommunityPage::find($id);
                if ($model) {
                    $url = route('platform.systems.community-pages.edit', $model);
                    $label = $model->name ?? 'Page #' . $id;
                }
                break;
        }
        if ($url && $label) {
            return ['url' => $url, 'label' => $label];
        }
        return null;
    }
}

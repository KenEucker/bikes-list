<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Upload;

use App\Models\Upload;
use App\Orchid\Layouts\Upload\UploadListLayout;
use App\Services\UploadStorageService;
use Illuminate\Support\Facades\Storage;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Layouts\Rows;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;

class BucketStatusScreen extends Screen
{
    public function query(): iterable
    {
        $storage = app(UploadStorageService::class);
        $disk = $storage->disk();
        $config = config('filesystems.disks.uploads');

        $connectivity = 'unknown';
        try {
            Storage::disk($disk)->files($storage->prefix());
            $connectivity = 'ok';
        } catch (\Throwable $e) {
            $connectivity = 'error: ' . $e->getMessage();
        }

        $total = Upload::query()->count();
        $processing = Upload::query()->where('status', Upload::STATUS_PROCESSING)->count();
        $failed = Upload::query()->where('status', Upload::STATUS_FAILED)->count();
        $ready = Upload::query()->where('status', Upload::STATUS_READY)->count();

        $connectivityOk = $connectivity === 'ok';
        $statusSummary = $connectivityOk
            ? __(':total uploads (:ready ready, :processing processing, :failed failed).', [
                'total' => $total,
                'ready' => $ready,
                'processing' => $processing,
                'failed' => $failed,
            ])
            : __('Bucket is not reachable. Check storage configuration and network.');

        $endpoint = $config['endpoint'] ?? '';
        if (is_string($endpoint) && $endpoint !== '') {
            $endpoint = preg_replace('#^([^:]+://[^/]*).*#', '$1', $endpoint) . ' (redacted)';
        }

        return [
            'disk' => $disk,
            'bucket' => $config['bucket'] ?? '',
            'endpoint' => $endpoint,
            'url' => $config['url'] ?? '',
            'connectivity' => $connectivity,
            'connectivity_ok' => $connectivityOk,
            'status_summary' => $statusSummary,
            'total_uploads' => $total,
            'processing' => $processing,
            'failed' => $failed,
            'ready' => $ready,
            'uploads' => Upload::query()
                ->with('createdBy')
                ->orderByDesc('created_at')
                ->paginate(10),
        ];
    }

    public function name(): ?string
    {
        return __('Bucket status');
    }

    public function description(): ?string
    {
        return __('Uploads storage connectivity and summary.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.uploads'];
    }

    public function commandBar(): iterable
    {
        return [
            Link::make(__('Uploads list'))
                ->icon('bs.list-ul')
                ->route('platform.uploads.list'),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::view('orchid.bucket-status-summary'),
            Layout::rows([
                \Orchid\Screen\Fields\Group::make([
                    \Orchid\Screen\Fields\Input::make('disk')->title(__('Disk'))->disabled(),
                    \Orchid\Screen\Fields\Input::make('bucket')->title(__('Bucket'))->disabled(),
                ]),
                \Orchid\Screen\Fields\Group::make([
                    \Orchid\Screen\Fields\Input::make('endpoint')->title(__('Endpoint'))->disabled(),
                    \Orchid\Screen\Fields\Input::make('url')->title(__('Public URL'))->disabled(),
                ]),
                \Orchid\Screen\Fields\Group::make([
                    \Orchid\Screen\Fields\Input::make('total_uploads')->title(__('Total uploads'))->disabled(),
                    \Orchid\Screen\Fields\Input::make('ready')->title(__('Ready'))->disabled(),
                    \Orchid\Screen\Fields\Input::make('processing')->title(__('Processing'))->disabled(),
                    \Orchid\Screen\Fields\Input::make('failed')->title(__('Failed'))->disabled(),
                ]),
            ]),
            UploadListLayout::class,
        ];
    }
}

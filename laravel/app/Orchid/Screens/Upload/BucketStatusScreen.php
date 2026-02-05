<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Upload;

use App\Models\Upload;
use App\Services\UploadStorageService;
use Illuminate\Support\Facades\Storage;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;
use Orchid\Screen\Layouts\Rows;
use Orchid\Support\Facades\Layout;

class BucketStatusScreen extends Screen
{
    public function query(): iterable
    {
        $storage = app(UploadStorageService::class);
        $disk = $storage->disk();
        $config = config('filesystems.disks.uploads');

        $connectivity = 'unknown';
        $writeTest = false;
        try {
            $list = Storage::disk($disk)->files($storage->prefix());
            $connectivity = 'ok';
        } catch (\Throwable $e) {
            $connectivity = 'error: ' . $e->getMessage();
        }

        $total = Upload::query()->count();
        $processing = Upload::query()->where('status', Upload::STATUS_PROCESSING)->count();
        $failed = Upload::query()->where('status', Upload::STATUS_FAILED)->count();
        $ready = Upload::query()->where('status', Upload::STATUS_READY)->count();

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
            'total_uploads' => $total,
            'processing' => $processing,
            'failed' => $failed,
            'ready' => $ready,
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
            Layout::rows([
                \Orchid\Screen\Fields\Group::make([
                    \Orchid\Screen\Fields\Input::make('disk')->title(__('Disk'))->disabled(),
                    \Orchid\Screen\Fields\Input::make('bucket')->title(__('Bucket'))->disabled(),
                ]),
                \Orchid\Screen\Fields\Group::make([
                    \Orchid\Screen\Fields\Input::make('endpoint')->title(__('Endpoint'))->disabled(),
                    \Orchid\Screen\Fields\Input::make('url')->title(__('Public URL'))->disabled(),
                ]),
                \Orchid\Screen\Fields\Input::make('connectivity')->title(__('Connectivity'))->disabled(),
                \Orchid\Screen\Fields\Group::make([
                    \Orchid\Screen\Fields\Input::make('total_uploads')->title(__('Total uploads'))->disabled(),
                    \Orchid\Screen\Fields\Input::make('ready')->title(__('Ready'))->disabled(),
                    \Orchid\Screen\Fields\Input::make('processing')->title(__('Processing'))->disabled(),
                    \Orchid\Screen\Fields\Input::make('failed')->title(__('Failed'))->disabled(),
                ]),
            ]),
        ];
    }
}

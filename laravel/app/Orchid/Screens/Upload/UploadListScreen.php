<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Upload;

use App\Models\Upload;
use App\Orchid\Layouts\Upload\UploadListLayout;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;

class UploadListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'uploads' => Upload::query()
                ->with('createdBy')
                ->orderByDesc('created_at')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Uploads');
    }

    public function description(): ?string
    {
        return __('All uploads (main images).');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.uploads'];
    }

    public function commandBar(): iterable
    {
        return [
            Link::make(__('Bucket status'))
                ->icon('bs.cloud-check')
                ->route('platform.uploads.bucket'),
        ];
    }

    public function layout(): iterable
    {
        return [
            UploadListLayout::class,
        ];
    }
}

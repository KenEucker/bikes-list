<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Upload;

use App\Models\Upload;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class UploadListLayout extends Table
{
    protected $target = 'uploads';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('thumbnail', __('Thumbnail'))
                ->width('80px')
                ->render(function (Upload $upload) {
                    $url = $upload->urlForVariant('lg');
                    if (! $url) {
                        return '—';
                    }
                    return new \Illuminate\Support\HtmlString('<img src="' . e($url) . '" alt="" style="max-width:64px;max-height:64px;object-fit:cover;">');
                }),
            TD::make('id', __('ID'))
                ->width('280px')
                ->render(fn (Upload $upload) => Link::make(substr($upload->id, 0, 8) . '…')->route('platform.uploads.detail', $upload)),
            TD::make('resource', __('Resource'))
                ->render(fn (Upload $upload) => $upload->resource_type && $upload->resource_id
                    ? $upload->resource_type . ' #' . $upload->resource_id
                    : '—'),
            TD::make('status', __('Status'))
                ->sort()
                ->render(fn (Upload $upload) => $upload->status),
            TD::make('created_at', __('Created'))
                ->sort()
                ->render(fn (Upload $upload) => $upload->created_at?->format('Y-m-d H:i')),
        ];
    }
}

<?php

namespace App\Orchid\Screens;

use App\Domain\Listings\ListingImage;
use Illuminate\Support\Facades\DB;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;

class ImageProcessingScreen extends Screen
{
    /**
     * Query data.
     *
     * @return array
     */
    public function query(): iterable
    {
        return [
            'stats' => [
                'total_images' => ListingImage::count(),
                'original_images' => ListingImage::where('variant', 'original')->count(),
                'processed_images' => ListingImage::where('variant', '!=', 'original')->count(),
            ],
        ];
    }

    /**
     * Display header name.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'Image Processing';
    }

    /**
     * Button commands.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): array
    {
        return [];
    }

    /**
     * Views.
     *
     * @return \Orchid\Screen\Layout[]|string[]
     */
    public function layout(): array
    {
        return [
            Layout::metrics([
                'Total Images' => 'stats.total_images',
                'Original Images' => 'stats.original_images',
                'Processed Images' => 'stats.processed_images',
            ]),
        ];
    }
}

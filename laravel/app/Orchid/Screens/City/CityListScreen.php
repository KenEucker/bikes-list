<?php

declare(strict_types=1);

namespace App\Orchid\Screens\City;

use App\Models\City;
use App\Orchid\Layouts\City\CityListLayout;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Toast;

class CityListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'cities' => City::query()->orderBy('name')->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Cities');
    }

    public function description(): ?string
    {
        return __('Manage cities shown on the frontend.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.cities'];
    }

    public function commandBar(): iterable
    {
        return [
            Link::make(__('Add'))
                ->icon('bs.plus-circle')
                ->route('platform.systems.cities.create'),
        ];
    }

    public function layout(): iterable
    {
        return [
            CityListLayout::class,
        ];
    }

    public function remove(Request $request): void
    {
        City::findOrFail($request->get('city'))->delete();
        Toast::info(__('City was removed.'));
    }
}

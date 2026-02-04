<?php

declare(strict_types=1);

namespace App\Orchid\Screens\City;

use App\Models\City;
use App\Orchid\Layouts\City\CityEditLayout;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class CityEditScreen extends Screen
{
    public ?City $city = null;

    public function query(?City $city = null): iterable
    {
        $this->city = $city ?? new City();

        return [
            'city' => $this->city,
        ];
    }

    public function name(): ?string
    {
        return $this->city->exists ? __('Edit City') : __('Create City');
    }

    public function description(): ?string
    {
        return __('Name, slug and description for the frontend city directory.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.cities'];
    }

    public function commandBar(): iterable
    {
        return [
            Button::make(__('Save'))
                ->icon('bs.check-circle')
                ->method('save'),

            Button::make(__('Remove'))
                ->icon('bs.trash3')
                ->method('remove')
                ->canSee($this->city->exists),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::block(CityEditLayout::class)
                ->title(__('City'))
                ->description(__('Slug is used in the URL (e.g. austin.localhost).')),
        ];
    }

    public function save(Request $request)
    {
        $request->validate([
            'city.name'        => ['required', 'string', 'max:255'],
            'city.slug'        => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9\-]+$/',
                Rule::unique(City::class, 'slug')->ignore($this->city),
            ],
            'city.description' => ['nullable', 'string'],
        ]);

        $this->city->fill($request->get('city'))->save();

        Toast::info(__('City was saved.'));

        return redirect()->route('platform.systems.cities');
    }

    public function remove(City $city)
    {
        $city->delete();

        Toast::info(__('City was removed.'));

        return redirect()->route('platform.systems.cities');
    }
}

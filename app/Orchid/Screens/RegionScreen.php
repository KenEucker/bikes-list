<?php

namespace App\Orchid\Screens;

use App\Domain\Regions\Region;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Alert;
use Illuminate\Http\Request;

class RegionScreen extends Screen
{
    /**
     * Query data.
     *
     * @return array
     */
    public function query(): iterable
    {
        return [
            'regions' => Region::paginate(),
        ];
    }

    /**
     * Display header name.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'Regions';
    }

    /**
     * Button commands.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): array
    {
        return [
            Button::make('Create Region')
                ->icon('plus')
                ->method('create'),
        ];
    }

    /**
     * Views.
     *
     * @return \Orchid\Screen\Layout[]|string[]
     */
    public function layout(): array
    {
        return [
            Layout::table('regions', [
                \Orchid\Screen\TD::make('id', 'ID'),
                \Orchid\Screen\TD::make('slug', 'Slug'),
                \Orchid\Screen\TD::make('name', 'Name'),
                \Orchid\Screen\TD::make('is_active', 'Active')
                    ->render(fn ($region) => $region->is_active ? 'Yes' : 'No'),
                \Orchid\Screen\TD::make('actions', 'Actions')
                    ->render(fn ($region) => Button::make('Edit')
                        ->method('edit', ['region' => $region->id])),
            ]),
        ];
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:regions,slug',
            'name' => 'required|string',
            'timezone' => 'required|string',
            'is_active' => 'boolean',
        ]);

        Region::create($validated);

        Alert::success('Region created successfully.');

        return redirect()->route('platform.regions');
    }
}

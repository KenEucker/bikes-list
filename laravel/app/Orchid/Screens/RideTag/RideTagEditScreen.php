<?php

declare(strict_types=1);

namespace App\Orchid\Screens\RideTag;

use App\Models\City;
use App\Models\RideTag;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Layouts\Rows;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class RideTagEditScreen extends Screen
{
    public ?RideTag $tag = null;

    public function query(?RideTag $tag = null): iterable
    {
        $this->tag = $tag ?? new RideTag();
        return [
            'tag' => $this->tag,
        ];
    }

    public function name(): ?string
    {
        return $this->tag->exists ? __('Edit tag') : __('New tag');
    }

    public function description(): ?string
    {
        return __('Tags appear in the ride form. Use Global for all cities.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.ride-tags'];
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
                ->confirm(__('Remove this tag?'))
                ->canSee($this->tag->exists),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::rows([
                Input::make('tag.slug')
                    ->type('text')
                    ->max(100)
                    ->required()
                    ->title(__('Slug'))
                    ->placeholder('e.g. no_drop'),
                Input::make('tag.label')
                    ->type('text')
                    ->max(255)
                    ->required()
                    ->title(__('Label'))
                    ->placeholder('e.g. No-drop'),
                Select::make('tag.city_id')
                    ->fromQuery(City::query()->orderBy('name'), 'name', 'id')
                    ->empty(__('Global'))
                    ->title(__('City (empty = global)')),
            ])->title(__('Tag'))
                ->description(__('Slug is stored on rides; label is shown to users. City optional for city-specific tags.')),
        ];
    }

    public function save(Request $request)
    {
        $request->validate([
            'tag.slug' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-z0-9_]+$/',
                Rule::unique('ride_tags', 'slug')->where('city_id', $request->input('tag.city_id'))->ignore($this->tag->id),
            ],
            'tag.label' => ['required', 'string', 'max:255'],
            'tag.city_id' => ['nullable', 'exists:cities,id'],
        ]);
        $data = $request->get('tag');
        $data['city_id'] = $data['city_id'] ?? null;
        $this->tag->fill($data)->save();
        Toast::info(__('Tag was saved.'));
        return redirect()->route('platform.systems.ride-tags');
    }

    public function remove(RideTag $tag)
    {
        $tag->delete();
        Toast::info(__('Tag was removed.'));
        return redirect()->route('platform.systems.ride-tags');
    }
}

<?php

declare(strict_types=1);

namespace App\Orchid\Screens\City;

use App\Models\City;
use App\Models\User;
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

    /** @var \Illuminate\Support\Collection<int, \App\Models\User> */
    public $usersForModerator;

    public function query(?City $city = null): iterable
    {
        $this->city = $city ?? new City();
        if ($this->city->exists) {
            $this->city->load('moderators');
            $moderatorIds = $this->city->moderators->pluck('id')->all();
            $this->usersForModerator = User::query()
                ->orderBy('name')
                ->when(!empty($moderatorIds), fn ($q) => $q->whereNotIn('id', $moderatorIds))
                ->limit(500)
                ->get();
        } else {
            $this->usersForModerator = collect();
        }

        return [
            'city' => $this->city,
            'usersForModerator' => $this->usersForModerator ?? collect(),
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

    public function addModerator(Request $request)
    {
        $city = City::findOrFail($request->input('city_id'));
        $userId = $request->input('user_id');
        if (!User::find($userId)) {
            Toast::error(__('User not found.'));
            return back();
        }
        $city->moderators()->syncWithoutDetaching([$userId => ['role' => 'moderator']]);
        Toast::info(__('User added as city moderator.'));
        return back();
    }

    public function removeModerator(Request $request)
    {
        $city = City::findOrFail($request->input('city_id'));
        $city->moderators()->detach($request->input('user_id'));
        Toast::info(__('User removed from city moderators.'));
        return back();
    }
}

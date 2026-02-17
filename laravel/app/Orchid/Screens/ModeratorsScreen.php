<?php

declare(strict_types=1);

namespace App\Orchid\Screens;

use App\Models\City;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class ModeratorsScreen extends Screen
{
    public function query(): iterable
    {
        $cityRows = DB::table('city_user')
            ->whereNotNull('city_id')
            ->join('users', 'users.id', '=', 'city_user.user_id')
            ->join('cities', 'cities.id', '=', 'city_user.city_id')
            ->select('city_user.user_id', 'city_user.city_id', 'users.name as user_name', 'users.email as user_email', 'cities.name as city_name')
            ->orderBy('users.name')
            ->orderBy('cities.name')
            ->get();

        $globalRows = DB::table('city_user')
            ->whereNull('city_id')
            ->where('role', 'global')
            ->join('users', 'users.id', '=', 'city_user.user_id')
            ->select('city_user.user_id', 'users.name as user_name', 'users.email as user_email')
            ->orderBy('users.name')
            ->get();

        $moderators = collect();
        foreach ($cityRows as $row) {
            $moderators->push((object) [
                'user_id' => $row->user_id,
                'user_name' => $row->user_name,
                'user_email' => $row->user_email,
                'cities_display' => $row->city_name,
                'is_global' => false,
                'city_id' => $row->city_id,
            ]);
        }
        foreach ($globalRows as $row) {
            $moderators->push((object) [
                'user_id' => $row->user_id,
                'user_name' => $row->user_name,
                'user_email' => $row->user_email,
                'cities_display' => __('Global (all cities)'),
                'is_global' => true,
                'city_id' => null,
            ]);
        }
        $moderators = $moderators->sortBy('user_name')->values();

        $allModeratorUserIds = $moderators->pluck('user_id')->unique()->values()->all();
        $usersForAdd = User::query()
            ->whereNotIn('id', $allModeratorUserIds)
            ->orderBy('name')
            ->limit(500)
            ->get();

        $cities = City::query()->orderBy('name')->get();

        return [
            'moderators' => $moderators,
            'usersForAdd' => $usersForAdd,
            'cities' => $cities,
            'addModeratorUrl' => rtrim(route('platform.systems.moderators'), '/') . '/addModerator',
            'removeCityModeratorUrl' => rtrim(route('platform.systems.moderators'), '/') . '/removeCityModerator',
            'removeGlobalModeratorUrl' => rtrim(route('platform.systems.moderators'), '/') . '/removeGlobalModerator',
            'csrf_token' => csrf_token(),
        ];
    }

    public function name(): ?string
    {
        return __('Moderators');
    }

    public function description(): ?string
    {
        return __('Assign city or global moderators. These users can moderate content on the frontend (they do not get backend admin access).');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.cities'];
    }

    public function layout(): iterable
    {
        return [
            Layout::block([
                Layout::view('orchid.moderators-add-form'),
            ])
                ->title(__('Add moderator'))
                ->description(__('Choose a user and assign as city moderator (one or more cities) or global moderator (all cities).')),
            Layout::table('moderators', [
                TD::make('user_name', __('User'))->render(fn ($row) => e($row->user_name) . ' (' . e($row->user_email) . ')'),
                TD::make('cities_display', __('Cities assigned'))->render(fn ($row) => e($row->cities_display ?? '')),
                TD::make(__('Actions'))->render(function ($row) {
                    if ($row->is_global) {
                        $url = rtrim(route('platform.systems.moderators'), '/') . '/removeGlobalModerator';
                        return '<button type="button" class="btn btn-sm btn-outline-danger moderator-remove-btn" ' .
                            'data-url="' . e($url) . '" data-user-id="' . (int) $row->user_id . '" data-is-global="1">' .
                            e(__('Remove')) . '</button>';
                    }
                    $url = rtrim(route('platform.systems.moderators'), '/') . '/removeCityModerator';
                    return '<button type="button" class="btn btn-sm btn-outline-danger moderator-remove-btn" ' .
                        'data-url="' . e($url) . '" data-user-id="' . (int) $row->user_id . '" data-city-id="' . (int) $row->city_id . '" data-is-global="0">' .
                        e(__('Remove')) . '</button>';
                }),
            ])->title(__('Moderators')),
        ];
    }

    public function addModerator(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'scope' => ['required', 'in:city,global'],
            'city_ids' => ['required_if:scope,city', 'array'],
            'city_ids.*' => ['required', 'exists:cities,id'],
        ]);

        $userId = (int) $request->input('user_id');
        $scope = $request->input('scope');

        if ($scope === 'global') {
            $exists = DB::table('city_user')
                ->where('user_id', $userId)
                ->whereNull('city_id')
                ->where('role', 'global')
                ->exists();
            if ($exists) {
                Toast::warning(__('This user is already a global moderator.'));
                return back();
            }
            DB::table('city_user')->insert([
                'user_id' => $userId,
                'city_id' => null,
                'role' => 'global',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            Toast::info(__('User added as global moderator.'));
            return back();
        }

        $cityIds = array_map('intval', (array) $request->input('city_ids', []));
        $cityIds = array_unique(array_filter($cityIds));
        if (empty($cityIds)) {
            Toast::warning(__('Select at least one city.'));
            return back();
        }

        $existing = DB::table('city_user')
            ->where('user_id', $userId)
            ->whereIn('city_id', $cityIds)
            ->pluck('city_id')
            ->all();
        $toAdd = array_diff($cityIds, $existing);
        $added = 0;
        foreach ($toAdd as $cityId) {
            DB::table('city_user')->insert([
                'user_id' => $userId,
                'city_id' => $cityId,
                'role' => 'moderator',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $added++;
        }
        if ($added > 0) {
            Toast::info($added === 1
                ? __('User added as city moderator.')
                : __('User added as moderator for :count cities.', ['count' => $added]));
        }
        if (count($toAdd) < count($cityIds)) {
            $skipped = count($cityIds) - count($toAdd);
            Toast::warning(__(':count assignment(s) already existed and were skipped.', ['count' => $skipped]));
        }
        return back();
    }

    public function removeCityModerator(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'city_id' => ['required', 'exists:cities,id'],
        ]);
        DB::table('city_user')
            ->where('user_id', $request->input('user_id'))
            ->where('city_id', $request->input('city_id'))
            ->delete();
        Toast::info(__('City moderator removed.'));
        return back();
    }

    public function removeGlobalModerator(Request $request)
    {
        $request->validate(['user_id' => ['required', 'exists:users,id']]);
        DB::table('city_user')
            ->where('user_id', $request->input('user_id'))
            ->whereNull('city_id')
            ->where('role', 'global')
            ->delete();
        Toast::info(__('Global moderator removed.'));
        return back();
    }
}

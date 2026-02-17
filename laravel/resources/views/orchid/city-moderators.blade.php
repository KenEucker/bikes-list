<div class="row">
    <div class="col-12">
        <h5 class="mb-3">{{ __('City moderators') }}</h5>
        <p class="text-muted small">{{ __('Users who can moderate sales, rides and community pages in this city.') }}</p>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>{{ __('User') }}</th>
                    <th width="100">{{ __('Actions') }}</th>
                </tr>
            </thead>
            <tbody>
                @forelse($city->moderators as $moderator)
                <tr>
                    <td>{{ $moderator->name }} ({{ $moderator->email }})</td>
                    <td>
                        <form action="{{ rtrim(route('platform.systems.cities.edit', $city), '/') }}/removeModerator" method="POST" class="d-inline">
                            @csrf
                            <input type="hidden" name="city_id" value="{{ $city->id }}">
                            <input type="hidden" name="user_id" value="{{ $moderator->id }}">
                            <button type="submit" class="btn btn-sm btn-outline-danger">{{ __('Remove') }}</button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr><td colspan="2">{{ __('No moderators.') }}</td></tr>
                @endforelse
            </tbody>
        </table>
        <form action="{{ rtrim(route('platform.systems.cities.edit', $city), '/') }}/addModerator" method="POST" class="row g-2 align-items-end">
            @csrf
            <input type="hidden" name="city_id" value="{{ $city->id }}">
            <div class="col-auto">
                <label for="add_moderator_user_id" class="form-label">{{ __('Add moderator') }}</label>
                <select name="user_id" id="add_moderator_user_id" class="form-select" required>
                    <option value="">{{ __('Select user…') }}</option>
                    @foreach($usersForModerator ?? [] as $u)
                    <option value="{{ $u->id }}">{{ $u->name }} ({{ $u->email }})</option>
                    @endforeach
                </select>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary">{{ __('Add moderator') }}</button>
            </div>
        </form>
    </div>
</div>

<div class="row">
    <div class="col-12">
        <table class="table table-bordered">
            <tr><th>ID</th><td>{{ $communityPage->id }}</td></tr>
            <tr><th>Name</th><td>{{ $communityPage->name }}</td></tr>
            <tr><th>Type</th><td>{{ $communityPage->type }}</td></tr>
            <tr><th>City</th><td>{{ $communityPage->city?->name }}</td></tr>
            <tr><th>State</th><td>{{ $communityPage->state }}</td></tr>
            <tr><th>About</th><td>{{ $communityPage->about }}</td></tr>
        </table>
    </div>
</div>

<div class="row mt-4">
    <div class="col-12">
        <h5 class="mb-3">{{ __('Manage membership') }}</h5>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>{{ __('User') }}</th>
                    <th>{{ __('Role') }}</th>
                    <th width="100">{{ __('Actions') }}</th>
                </tr>
            </thead>
            <tbody>
                @forelse($communityPage->managers as $manager)
                <tr>
                    <td>{{ $manager->name }} ({{ $manager->email }})</td>
                    <td>{{ $manager->pivot->role ?? '—' }}</td>
                    <td>
                        <form action="{{ rtrim(route('platform.systems.community-pages.edit', $communityPage), '/') }}/removeManager" method="POST" class="d-inline">
                            @csrf
                            <input type="hidden" name="community_page_id" value="{{ $communityPage->id }}">
                            <input type="hidden" name="user_id" value="{{ $manager->id }}">
                            <button type="submit" class="btn btn-sm btn-outline-danger">{{ __('Remove') }}</button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr><td colspan="3">{{ __('No managers.') }}</td></tr>
                @endforelse
            </tbody>
        </table>
        <form action="{{ rtrim(route('platform.systems.community-pages.edit', $communityPage), '/') }}/addManager" method="POST" class="row g-2 align-items-end">
            @csrf
            <input type="hidden" name="community_page_id" value="{{ $communityPage->id }}">
            <div class="col-auto">
                <label for="add_user_id" class="form-label">{{ __('Add user') }}</label>
                <select name="user_id" id="add_user_id" class="form-select" required>
                    <option value="">{{ __('Select user…') }}</option>
                    @foreach($usersForManager ?? [] as $u)
                    <option value="{{ $u->id }}">{{ $u->name }} ({{ $u->email }})</option>
                    @endforeach
                </select>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary">{{ __('Add manager') }}</button>
            </div>
        </form>
    </div>
</div>

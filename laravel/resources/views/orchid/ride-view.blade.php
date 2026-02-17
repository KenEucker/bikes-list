<div class="row">
    <div class="col-12">
        <table class="table table-bordered">
            <tr><th>ID</th><td>{{ $ride->id }}</td></tr>
            <tr><th>Name</th><td>{{ $ride->name }}</td></tr>
            <tr><th>City</th><td>{{ $ride->city?->name }}</td></tr>
            <tr><th>State</th><td>{{ $ride->state }}</td></tr>
            <tr><th>Audience</th><td>{{ $ride->audience?->name ?? '—' }}</td></tr>
            <tr><th>Starts at</th><td>{{ $ride->starts_at?->toDateTimeString() }}</td></tr>
            <tr><th>Ends at</th><td>{{ $ride->ends_at?->toDateTimeString() }}</td></tr>
            <tr><th>User</th><td>{{ $ride->user?->name ?? '—' }}</td></tr>
            <tr><th>Location name</th><td>{{ $ride->location_name ?? '—' }}</td></tr>
            <tr><th>Address</th><td>{{ $ride->location_address ?? '—' }}</td></tr>
            <tr><th>Description</th><td>{{ $ride->description }}</td></tr>
        </table>
    </div>
</div>

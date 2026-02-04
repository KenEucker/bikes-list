<div class="row">
    <div class="col-12">
        <table class="table table-bordered">
            <tr><th>ID</th><td>{{ $event->id }}</td></tr>
            <tr><th>Title</th><td>{{ $event->title }}</td></tr>
            <tr><th>City</th><td>{{ $event->city?->name }}</td></tr>
            <tr><th>State</th><td>{{ $event->state }}</td></tr>
            <tr><th>Starts at</th><td>{{ $event->starts_at?->toDateTimeString() }}</td></tr>
            <tr><th>Ends at</th><td>{{ $event->ends_at?->toDateTimeString() }}</td></tr>
            <tr><th>User</th><td>{{ $event->user?->name }}</td></tr>
            <tr><th>Description</th><td>{{ $event->description }}</td></tr>
        </table>
    </div>
</div>

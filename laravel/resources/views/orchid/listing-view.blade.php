<div class="row">
    <div class="col-12">
        <table class="table table-bordered">
            <tr><th>ID</th><td>{{ $listing->id }}</td></tr>
            <tr><th>Title</th><td>{{ $listing->title }}</td></tr>
            <tr><th>City</th><td>{{ $listing->city?->name }}</td></tr>
            <tr><th>Type</th><td>{{ $listing->type }}</td></tr>
            <tr><th>State</th><td>{{ $listing->state }}</td></tr>
            <tr><th>Price</th><td>{{ $listing->price !== null ? '$' . number_format((float) $listing->price, 2) : 'Free' }}</td></tr>
            <tr><th>User</th><td>{{ $listing->user?->name }}</td></tr>
            <tr><th>Community Page</th><td>{{ $listing->communityPage?->name ?? '—' }}</td></tr>
            <tr><th>Description</th><td>{{ $listing->description }}</td></tr>
            <tr><th>Published at</th><td>{{ $listing->published_at?->toDateTimeString() ?? '—' }}</td></tr>
            <tr><th>Updated at</th><td>{{ $listing->updated_at->toDateTimeString() }}</td></tr>
        </table>
    </div>
</div>

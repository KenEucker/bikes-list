<div class="row">
    <div class="col-12">
        <table class="table table-bordered">
            <tr><th>ID</th><td>{{ $sale->id }}</td></tr>
            <tr><th>Title</th><td>{{ $sale->title }}</td></tr>
            <tr><th>City</th><td>{{ $sale->city?->name }}</td></tr>
            <tr><th>Type</th><td>{{ $sale->type }}</td></tr>
            <tr><th>State</th><td>{{ $sale->state }}</td></tr>
            <tr><th>Price</th><td>{{ $sale->price !== null ? '$' . number_format((float) $sale->price, 2) : 'Free' }}</td></tr>
            <tr><th>User</th><td>{{ $sale->user?->name }}</td></tr>
            <tr><th>Community Page</th><td>{{ $sale->communityPage?->name ?? '—' }}</td></tr>
            <tr><th>Description</th><td>{{ $sale->description }}</td></tr>
            <tr><th>Photos</th>
                <td>
                    @if($sale->uploads && $sale->uploads->isNotEmpty())
                        <div class="d-flex flex-wrap gap-2">
                            @foreach($sale->uploads as $upload)
                                @php $thumb = $upload->urlForVariant('sm') ?: $upload->urlForVariant('lg'); @endphp
                                @if($thumb)
                                    <a href="{{ $upload->urlForVariant('lg') ?? $thumb }}" target="_blank" rel="noopener"><img src="{{ $thumb }}" alt="" class="rounded border" style="max-height: 80px; max-width: 120px; object-fit: cover;"></a>
                                @else
                                    <span class="badge bg-secondary">{{ $upload->status ?? '—' }}</span>
                                @endif
                            @endforeach
                        </div>
                        <small class="text-muted">{{ $sale->uploads->count() }} photo(s) attached</small>
                    @else
                        — No photos
                    @endif
                </td>
            </tr>
            <tr><th>Published at</th><td>{{ $sale->published_at?->toDateTimeString() ?? '—' }}</td></tr>
            <tr><th>Updated at</th><td>{{ $sale->updated_at->toDateTimeString() }}</td></tr>
        </table>
    </div>
</div>

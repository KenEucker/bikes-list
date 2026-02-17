@php
    $opts = config('sale_types.full_bicycle_options', []);
    $conditions = config('sale_types.conditions', []);
    $row = function ($label, $value) {
        if ($value === null || $value === '') return null;
        return compact('label', 'value');
    };
    $postingRows = [];
    if ($sale->type === 'full_bicycle') {
        if (($v = $sale->frame_size)) $postingRows[] = $row('Frame size', $v);
        if (($v = $sale->make)) $postingRows[] = $row('Make', $v);
        if (($v = $sale->model)) $postingRows[] = $row('Model', $v);
        if (($v = $sale->serial_number) && !$sale->serial_private) $postingRows[] = $row('Serial number', $v);
        if (($v = $sale->bicycle_type)) $postingRows[] = $row('Bicycle type', $opts['bicycle_type'][$v] ?? $v);
        if (($v = $sale->wheel_size)) $postingRows[] = $row('Wheel size', $opts['wheel_size'][$v] ?? $v);
        if (($v = $sale->frame_material)) $postingRows[] = $row('Frame material', $opts['frame_material'][$v] ?? $v);
        if (($v = $sale->suspension)) $postingRows[] = $row('Suspension', $opts['suspension'][$v] ?? $v);
        if (($v = $sale->handlebar_type)) $postingRows[] = $row('Handlebar type', $opts['handlebar_type'][$v] ?? $v);
        if (($v = $sale->electric_assist)) $postingRows[] = $row('Electric assist', $opts['electric_assist'][$v] ?? $v);
        if (($v = $sale->condition)) $postingRows[] = $row('Condition', $conditions[$v] ?? $v);
    }
@endphp
<div class="row">
    <div class="col-12">
        <table class="table table-bordered">
            <tr><th>ID</th><td>{{ $sale->id }}</td></tr>
            <tr><th>Title</th><td>{{ $sale->title }}</td></tr>
            <tr><th>City</th><td>{{ $sale->city?->name }}</td></tr>
            <tr><th>Type</th><td>{{ $sale->type }}</td></tr>
            <tr><th>State</th><td>{{ $sale->state }}</td></tr>
            <tr><th>Price</th><td>{{ $sale->price !== null ? '$' . number_format((float) $sale->price, 2) : 'Free' }}</td></tr>
            <tr><th>Condition</th><td>{{ $sale->condition ? ($conditions[$sale->condition] ?? $sale->condition) : '—' }}</td></tr>
            <tr><th>Contact email</th><td>{{ $sale->contact_email ?? '—' }}</td></tr>
            <tr><th>User</th><td>{{ $sale->user?->name ?? '—' }}</td></tr>
            <tr><th>Community Page</th><td>{{ $sale->communityPage?->name ?? '—' }}</td></tr>
            <tr><th>Location</th><td>{{ $sale->location_address ?? '—' }}</td></tr>
            <tr><th>Description</th><td>{{ $sale->description }}</td></tr>
            @if(count($postingRows) > 0)
            <tr><th>Posting details (bike)</th><td>
                <table class="table table-sm table-bordered mb-0">
                    @foreach($postingRows as $r)
                    <tr><th class="text-nowrap">{{ $r['label'] }}</th><td>{{ $r['value'] }}</td></tr>
                    @endforeach
                </table>
            </td></tr>
            @endif
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

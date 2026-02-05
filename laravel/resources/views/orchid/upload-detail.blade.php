@if($upload->status !== 'ready')
    <div class="alert alert-warning mb-3">
        @if($upload->status === 'processing')
            <p class="mb-0">{{ __('This upload is still processing. If it stays like this, ensure a queue worker is running') }} (<code>php artisan queue:work</code>) {{ __('or run') }} <code>php artisan uploads:retry</code> {{ __('or use "Retry processing" above.') }}</p>
        @elseif($upload->status === 'failed')
            <p class="mb-0">{{ __('Processing failed. If the original file is still in storage, use "Retry processing" above or run') }} <code>php artisan uploads:retry {{ $upload->id }}</code>.</p>
        @endif
    </div>
@endif

<div class="row">
    <div class="col-md-6">
        @php $lgUrl = ($upload->status === 'ready') ? ($variant_urls['lg'] ?? null) : null; @endphp
        @if($lgUrl)
            <p class="mb-2"><strong>{{ __('Main image (lg)') }}</strong></p>
            <img src="{{ $lgUrl }}" alt="" class="img-fluid rounded border" style="max-height: 400px;">
        @else
            <p class="text-muted">{{ $upload->status === 'ready' ? __('No main image.') : __('Variants not ready yet.') }}</p>
        @endif
    </div>
    <div class="col-md-6">
        <table class="table table-bordered">
            <tr><th>{{ __('ID') }}</th><td><code>{{ $upload->id }}</code></td></tr>
            <tr><th>{{ __('Status') }}</th><td>{{ $upload->status }}</td></tr>
            <tr><th>{{ __('Resource type') }}</th><td>{{ $upload->resource_type ?? '—' }}</td></tr>
            <tr><th>{{ __('Resource ID') }}</th><td>{{ $upload->resource_id ?? '—' }}</td></tr>
            @if($resource_url && $resource_label)
                <tr><th>{{ __('Linked resource') }}</th><td><a href="{{ $resource_url }}">{{ $resource_label }}</a></td></tr>
            @endif
            <tr><th>{{ __('Dimensions') }}</th><td>{{ $upload->width }} × {{ $upload->height }}</td></tr>
            <tr><th>{{ __('Created at') }}</th><td>{{ $upload->created_at->toDateTimeString() }}</td></tr>
            <tr><th>{{ __('Uploader') }}</th><td>{{ $upload->createdBy?->name ?? '—' }}</td></tr>
        </table>

        <h6 class="mt-3">{{ __('Variant URLs') }}</h6>
        @if($upload->status === 'ready')
            <ul class="list-unstyled">
                @foreach(['sm', 'md', 'lg'] as $v)
                    @php $url = $variant_urls[$v] ?? null; $key = $variant_keys[$v] ?? ''; @endphp
                    <li class="mb-2">
                        <strong>{{ $v }}:</strong>
                        @if($url)
                            <a href="{{ $url }}" target="_blank" rel="noopener">{{ $url }}</a>
                        @else
                            <span class="text-muted">—</span>
                        @endif
                        @if($key)
                            <br><small class="text-muted"><code>{{ $key }}</code></small>
                        @endif
                    </li>
                @endforeach
            </ul>
        @else
            <p class="text-muted">{{ __('Variant keys (objects not created until processing completes):') }}</p>
            <ul class="list-unstyled">
                @foreach(['sm', 'md', 'lg'] as $v)
                    @php $key = $variant_keys[$v] ?? ''; @endphp
                    <li class="mb-2"><strong>{{ $v }}:</strong> <code>{{ $key ?: '—' }}</code></li>
                @endforeach
            </ul>
        @endif
    </div>
</div>

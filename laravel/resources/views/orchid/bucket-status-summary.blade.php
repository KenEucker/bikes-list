@php
    $ok = $connectivity_ok ?? (($connectivity ?? '') === 'ok');
    $message = $connectivity ?? 'unknown';
@endphp
<div class="mb-4">
    <p class="mb-2">
        <span class="badge {{ $ok ? 'bg-success' : 'bg-danger' }} me-2">
            {{ $ok ? __('Bucket') . ': ' . __('OK') : __('Bucket') . ': ' . __('Error') }}
        </span>
        @if (!$ok && is_string($message) && $message !== '')
            <span class="text-muted small">{{ $message }}</span>
        @endif
    </p>
    <p class="text-muted small mb-0">{{ $status_summary ?? '' }}</p>
</div>

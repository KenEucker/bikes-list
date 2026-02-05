@push('head')
    <meta name="robots" content="noindex"/>
    <meta name="google" content="notranslate">
    <link
          href="{{ asset('/bikeslist.png') }}"
          sizes="any"
          type="image/png"
          id="favicon"
          rel="icon"
    >

    <!-- theme-color can be set dynamically via JS to match data-theme -->
@endpush

<div class="h2 d-flex align-items-center gap-2">
    @auth
        <x-orchid-icon path="bs.house" class="d-inline d-lg-none"/>
    @endauth

    <a href="{{ route(config('platform.index')) }}" class="d-flex align-items-center gap-2 text-body-emphasis text-decoration-none">
        <img src="{{ asset('/bikeslist.png') }}" alt="BikesList" class="d-none d-lg-block" style="height: 2rem; width: auto;" />
        <span class="my-0 {{ auth()->check() ? 'd-none d-lg-block' : '' }}">{{ config('app.name') }}</span>
    </a>
</div>

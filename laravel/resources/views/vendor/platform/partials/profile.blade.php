<div class="profile-container d-flex align-items-stretch p-3 rounded lh-sm position-relative overflow-hidden">
    <a href="{{ route(config('platform.profile', 'platform.profile')) }}" class="col-8 d-flex align-items-center gap-3 text-decoration-none">
        @if($image = Auth::user()->presenter()->image())
            <img src="{{$image}}"  alt="{{ Auth::user()->presenter()->title()}}" class="thumb-sm avatar b" type="image/*">
        @endif

        <small class="d-flex flex-column lh-1 col-9">
            <span class="text-ellipsis text-white">{{Auth::user()->presenter()->title()}}</span>
            <span class="text-ellipsis text-muted">{{Auth::user()->presenter()->subTitle()}}</span>
        </small>
    </a>

    @include('platform::partials.theme-toggle')

    <x-orchid-notification/>
</div>

<div class="settings-filters-bar g-0 rounded mb-3 overflow-hidden" id="settings-filters-bar" role="search">
    <div class="row align-items-center gap-2 gap-md-3 p-3 m-0" style="min-width: 0;" data-settings-filter-url="{{ request()->url() }}">
        <div class="col-auto d-flex align-items-center gap-2">
            <label class="form-label mb-0 text-nowrap" for="settings-filter-hide-secrets">{{ __('Hide secrets') }}</label>
            <select id="settings-filter-hide-secrets" class="form-select form-select-sm settings-filter-field" style="width: auto; min-width: 5rem;" name="hide_secrets">
                <option value="1" {{ request('hide_secrets', '1') == '1' ? 'selected' : '' }}>{{ __('Yes') }}</option>
                <option value="0" {{ request('hide_secrets') === '0' ? 'selected' : '' }}>{{ __('No') }}</option>
            </select>
        </div>
        <div class="col-auto d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0">
            <label class="form-label mb-0 text-nowrap" for="settings-filter-search">{{ __('Search') }}</label>
            <input type="text" id="settings-filter-search" class="form-control form-control-sm settings-filter-field" value="{{ request('search') }}" placeholder="{{ __('e.g. APP_') }}" style="min-width: 8rem; max-width: 12rem;" name="search">
        </div>
        <div class="col-auto d-flex align-items-center gap-2">
            <label class="form-label mb-0 text-nowrap" for="settings-filter-source">{{ __('Source') }}</label>
            <select id="settings-filter-source" class="form-select form-select-sm settings-filter-field" style="width: auto; min-width: 7rem;" name="source">
                <option value="">{{ __('All') }}</option>
                <option value="database" {{ request('source') === 'database' ? 'selected' : '' }}>{{ __('Database') }}</option>
                <option value="env" {{ request('source') === 'env' ? 'selected' : '' }}>{{ __('ENV') }}</option>
                <option value="example" {{ request('source') === 'example' ? 'selected' : '' }}>{{ __('Example') }}</option>
                <option value="unknown" {{ request('source') === 'unknown' ? 'selected' : '' }}>{{ __('Unknown') }}</option>
            </select>
        </div>
        <div class="col-auto">
            <button type="button" class="btn btn-sm btn-primary" id="settings-filter-apply">{{ __('Apply') }}</button>
        </div>
    </div>
</div>
<a href="#settings-table" class="visually-hidden-focusable skip-link">{{ __('Skip to list') }}</a>
<script>
(function() {
    var btn = document.getElementById('settings-filter-apply');
    if (!btn) return;
    btn.addEventListener('click', function() {
        var wrap = btn.closest('[data-settings-filter-url]');
        var url = wrap.getAttribute('data-settings-filter-url');
        var params = new URLSearchParams();
        wrap.querySelectorAll('.settings-filter-field').forEach(function(el) {
            var name = el.getAttribute('name');
            if (name) params.set(name, el.value);
        });
        window.location = url + (params.toString() ? '?' + params.toString() : '');
    });
})();
</script>

{{-- CSRF for JS-submitted forms (Add + Remove). Not a form itself so we avoid nesting inside Orchid's #post-form. --}}
<input type="hidden" id="moderators-csrf" value="{{ $csrf_token ?? '' }}">

<div id="moderators-add" class="row g-2 align-items-end">
    <div class="col-auto">
        <label for="moderator_user_id" class="form-label">{{ __('User') }}</label>
        <select id="moderator_user_id" class="form-select" required style="min-width: 220px;">
            <option value="">{{ __('Select user…') }}</option>
            @foreach($usersForAdd ?? [] as $u)
            <option value="{{ $u->id }}">{{ $u->name }} ({{ $u->email }})</option>
            @endforeach
        </select>
    </div>
    <div class="col-auto">
        <label for="moderator_scope" class="form-label">{{ __('Type') }}</label>
        <select id="moderator_scope" class="form-select" required>
            <option value="city">{{ __('City moderator') }}</option>
            <option value="global">{{ __('Global moderator (all cities)') }}</option>
        </select>
    </div>
    <div class="col-auto" id="moderator_city_wrap">
        <label class="form-label">{{ __('Cities') }}</label>
        <div id="moderator_city_pills" class="d-flex flex-wrap gap-1 mb-2 min-height-pills" style="min-height: 2rem;"></div>
        <div class="dropdown moderator-city-dropdown">
            <button type="button" class="btn btn-outline-secondary btn-sm dropdown-toggle" id="moderator_city_toggle" data-bs-toggle="dropdown" aria-expanded="false">
                {{ __('Select cities…') }}
            </button>
            <ul class="dropdown-menu moderator-city-menu px-2" style="max-height: 20rem; overflow: hidden; display: flex; flex-direction: column;">
                <li class="dropdown-item-text py-2 sticky-top bg-body border-bottom moderator-city-search-wrap">
                    <input type="text" class="form-control form-control-sm" id="moderator_city_search" placeholder="{{ __('Search cities…') }}" autocomplete="off">
                </li>
                <li class="list-unstyled overflow-auto flex-grow-1" style="max-height: 16rem;">
                    <ul class="list-unstyled px-0 mb-0" id="moderator_city_list">
                        @foreach($cities ?? [] as $c)
                        <li class="dropdown-item-text py-1 moderator-city-row" data-city-name="{{ e($c->name) }}">
                            <label class="d-flex align-items-center gap-2 mb-0 cursor-pointer">
                                <input type="checkbox" class="form-check-input moderator-city-cb" value="{{ $c->id }}" data-city-name="{{ e($c->name) }}">
                                <span>{{ $c->name }}</span>
                            </label>
                        </li>
                        @endforeach
                    </ul>
                </li>
            </ul>
        </div>
    </div>
    <div class="col-auto">
        <button type="button" id="moderator_submit_btn" class="btn btn-primary">{{ __('Add moderator') }}</button>
    </div>
</div>

<style>
.moderator-city-menu .dropdown-item-text { cursor: default; }
.moderator-city-menu .form-check-input { cursor: pointer; }
.moderator-city-pill { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.2rem 0.5rem; font-size: 0.875rem; background: var(--bs-secondary-bg, #e9ecef); border-radius: 9999px; }
.moderator-city-pill-remove { background: none; border: none; padding: 0 0.15rem; line-height: 1; cursor: pointer; opacity: 0.7; font-size: 1rem; }
.moderator-city-pill-remove:hover { opacity: 1; }
</style>
<script>
(function() {
    var addUrl = @json($addModeratorUrl ?? '');
    var i18n = {
        selectCities: @json(__('Select cities…')),
        oneCitySelected: @json(__('1 city selected')),
        citiesSelected: @json(__('cities selected')),
        remove: @json(__('Remove'))
    };
    var scopeEl = document.getElementById('moderator_scope');
    var cityWrap = document.getElementById('moderator_city_wrap');
    var pillsContainer = document.getElementById('moderator_city_pills');
    var cityToggle = document.getElementById('moderator_city_toggle');
    var IFRAME_NAME = 'moderators-post-iframe';

    function getSelectedCityIds() {
        if (!pillsContainer) return [];
        var pills = pillsContainer.querySelectorAll('[data-city-id]');
        return [].map.call(pills, function(p) { return p.getAttribute('data-city-id'); });
    }

    function updatePillsAndToggle() {
        var ids = getSelectedCityIds();
        if (cityToggle) cityToggle.textContent = ids.length ? (ids.length === 1 ? i18n.oneCitySelected : ids.length + ' ' + i18n.citiesSelected) : i18n.selectCities;
    }

    function addPill(cityId, cityName) {
        if (!pillsContainer) return;
        if (pillsContainer.querySelector('[data-city-id="' + cityId + '"]')) return;
        var pill = document.createElement('span');
        pill.className = 'moderator-city-pill';
        pill.setAttribute('data-city-id', cityId);
        pill.innerHTML = '<span>' + (cityName || '') + '</span> <button type="button" class="moderator-city-pill-remove" aria-label="' + (i18n.remove || 'Remove') + '">&times;</button>';
        var removeBtn = pill.querySelector('.moderator-city-pill-remove');
        removeBtn.addEventListener('click', function() {
            var cb = document.querySelector('.moderator-city-cb[value="' + cityId + '"]');
            if (cb) cb.checked = false;
            pill.remove();
            updatePillsAndToggle();
        });
        pillsContainer.appendChild(pill);
        updatePillsAndToggle();
    }

    function toggleCity() {
        if (!scopeEl || !cityWrap) return;
        if (scopeEl.value === 'global') {
            cityWrap.classList.add('d-none');
            if (pillsContainer) pillsContainer.innerHTML = '';
            [].forEach.call(document.querySelectorAll('.moderator-city-cb'), function(cb) { cb.checked = false; });
            updatePillsAndToggle();
        } else {
            cityWrap.classList.remove('d-none');
        }
    }

    if (pillsContainer && cityWrap) {
        cityWrap.addEventListener('change', function(e) {
            if (e.target && e.target.classList && e.target.classList.contains('moderator-city-cb')) {
                var cb = e.target;
                if (cb.checked) addPill(cb.value, cb.getAttribute('data-city-name'));
                else {
                    var pill = pillsContainer.querySelector('[data-city-id="' + cb.value + '"]');
                    if (pill) pill.remove();
                    updatePillsAndToggle();
                }
            }
        });
    }
    if (scopeEl) {
        scopeEl.addEventListener('change', toggleCity);
        toggleCity();
    }

    var cityMenu = document.querySelector('.moderator-city-menu');
    if (cityMenu) cityMenu.addEventListener('click', function(e) { e.stopPropagation(); });

    var citySearch = document.getElementById('moderator_city_search');
    var cityList = document.getElementById('moderator_city_list');
    function filterCityRows() {
        if (!cityList || !citySearch) return;
        var q = (citySearch.value || '').trim().toLowerCase();
        var rows = cityList.querySelectorAll('.moderator-city-row');
        rows.forEach(function(li) {
            var name = (li.getAttribute('data-city-name') || li.textContent || '').toLowerCase();
            li.style.display = q === '' || name.indexOf(q) !== -1 ? '' : 'none';
        });
    }
    if (citySearch) {
        citySearch.addEventListener('input', filterCityRows);
        citySearch.addEventListener('keydown', function(e) { e.stopPropagation(); });
    }
    var dropdownEl = document.querySelector('.moderator-city-dropdown');
    if (dropdownEl && citySearch) {
        dropdownEl.addEventListener('shown.bs.dropdown', function() {
            citySearch.value = '';
            filterCityRows();
            citySearch.focus();
        });
    }

    function ensureIframe() {
        var iframe = document.getElementById(IFRAME_NAME);
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = IFRAME_NAME;
            iframe.name = IFRAME_NAME;
            iframe.setAttribute('style', 'position:absolute;width:0;height:0;border:0;visibility:hidden');
            document.body.appendChild(iframe);
        }
        return iframe;
    }

    function submitThenReplaceBody(form, iframe) {
        iframe.onload = function() {
            try {
                var doc = iframe.contentDocument;
                if (doc && doc.body && doc.location.href && !doc.location.href.startsWith('about:')) {
                    document.open();
                    document.write(doc.documentElement.outerHTML);
                    document.close();
                }
            } catch (err) {}
        };
        form.target = IFRAME_NAME;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.submit();
    }

    var addBtn = document.getElementById('moderator_submit_btn');
    if (addBtn && addUrl) {
        addBtn.addEventListener('click', function() {
            var userId = document.getElementById('moderator_user_id').value;
            var scope = scopeEl ? scopeEl.value : 'city';
            var cityIds = getSelectedCityIds();
            if (!userId) return;
            if (scope === 'city' && cityIds.length === 0) {
                if (cityToggle) cityToggle.focus();
                return;
            }
            var form = document.createElement('form');
            form.method = 'POST';
            form.action = addUrl;
            var token = document.getElementById('moderators-csrf');
            if (token && token.value) {
                var t = document.createElement('input');
                t.name = '_token';
                t.value = token.value;
                form.appendChild(t);
            }
            var u = document.createElement('input');
            u.name = 'user_id';
            u.value = userId;
            form.appendChild(u);
            var s = document.createElement('input');
            s.name = 'scope';
            s.value = scope;
            form.appendChild(s);
            if (scope === 'city' && cityIds.length) {
                cityIds.forEach(function(id) {
                    var c = document.createElement('input');
                    c.name = 'city_ids[]';
                    c.value = id;
                    form.appendChild(c);
                });
            }
            submitThenReplaceBody(form, ensureIframe());
        });
    }

    document.body.addEventListener('click', function(e) {
        var btn = e.target.closest('.moderator-remove-btn');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        var url = btn.getAttribute('data-url');
        var userId = btn.getAttribute('data-user-id');
        var isGlobal = btn.getAttribute('data-is-global') === '1';
        var cityId = btn.getAttribute('data-city-id');
        if (!url || !userId) return;
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        var token = document.getElementById('moderators-csrf');
        if (token && token.value) {
            var t = document.createElement('input');
            t.name = '_token';
            t.value = token.value;
            form.appendChild(t);
        }
        var u = document.createElement('input');
        u.name = 'user_id';
        u.value = userId;
        form.appendChild(u);
        if (!isGlobal && cityId) {
            var c = document.createElement('input');
            c.name = 'city_id';
            c.value = cityId;
            form.appendChild(c);
        }
        submitThenReplaceBody(form, ensureIframe());
    });
})();
</script>

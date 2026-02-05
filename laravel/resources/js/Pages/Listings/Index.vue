<script setup>
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { computed, reactive } from 'vue';
import CityLayout from '@/Layouts/CityLayout.vue';

const page = usePage();
const urls = page.props.urls || {};

const props = defineProps({
    city: { type: Object, required: true },
    listings: { type: Object, required: true },
    filters: { type: Object, default: () => ({}) },
    listingTypes: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const form = reactive({
    q: props.filters.q ?? '',
    type: props.filters.type ?? '',
    min_price: props.filters.min_price ?? '',
    max_price: props.filters.max_price ?? '',
});

/** Only types that have a label (excludes e.g. "conditions" from config) */
const listingTypeOptions = computed(() => {
    return Object.entries(props.listingTypes).filter(
        ([, config]) => config && typeof config === 'object' && config.label
    );
});

function search() {
    const url = `${props.cityBaseUrl}/listings`;
    router.get(url, {
        q: form.q || undefined,
        type: form.type || undefined,
        min_price: form.min_price || undefined,
        max_price: form.max_price || undefined,
    }, { preserveState: true });
}

function saveSearchUrl() {
    const params = new URLSearchParams({
        save: '1',
        city_id: props.city.id,
        name: `${props.city.name} – ${form.q || 'Listings'}`,
        ...(form.q && { 'query[q]': form.q }),
        ...(form.type && { 'query[type]': form.type }),
        ...(form.min_price && { 'query[min_price]': form.min_price }),
        ...(form.max_price && { 'query[max_price]': form.max_price }),
    });
    return (props.homeUrl || '').replace(/\/$/, '') + '/account/saved-searches?' + params.toString();
}
</script>

<template>
    <Head :title="`Listings – ${city.name}`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" breadcrumb="Listings">
        <template #nav-right>
            <gv-header-navigation-item v-if="$page.props.auth?.user" :href="$page.props.urls?.accountSettings || '/account/settings'" text="Profile" />
            <gv-header-navigation-item v-else :href="$page.props.urls?.signIn || '/account/sign-in'" text="Log in" />
        </template>

        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div class="mb-6 grid gap-4 rounded-token-md border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
                <div class="min-w-0 col-span-full">
                    <gv-input
                        id="search-q"
                        v-model="form.q"
                        label="Search"
                        type="text"
                        placeholder="Keywords..."
                        class="govuk-!-width-full"
                        @keyup.enter="search"
                    />
                </div>
                <div class="min-w-0">
                    <gv-select
                        id="search-type"
                        v-model="form.type"
                        label="Type"
                        class="govuk-!-width-full"
                    >
                        <gv-select-option value="">All</gv-select-option>
                        <gv-select-option v-for="[key, config] in listingTypeOptions" :key="key" :value="key">{{ config.label }}</gv-select-option>
                    </gv-select>
                </div>
                <div class="min-w-0">
                    <gv-input
                        id="search-min-price"
                        v-model="form.min_price"
                        label="Min $"
                        type="number"
                        inputmode="decimal"
                        class="govuk-!-width-full"
                    />
                </div>
                <div class="min-w-0">
                    <gv-input
                        id="search-max-price"
                        v-model="form.max_price"
                        label="Max $"
                        type="number"
                        inputmode="decimal"
                        class="govuk-!-width-full"
                    />
                </div>
                <div class="govuk-button-group min-w-0 sm:col-span-2 lg:col-span-1">
                    <gv-button type="button" variant="primary" @click="search">Search</gv-button>
                    <Link v-if="$page.props.auth?.user" :href="saveSearchUrl()" class="govuk-link">Save search</Link>
                </div>
            </div>

            <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h1 class="govuk-heading-l">Listings</h1>
                <Link v-if="$page.props.auth?.user" :href="`${cityBaseUrl}/listings/new`" class="govuk-button" role="button">New listing</Link>
            </div>
            <ul class="govuk-list govuk-!-margin-top-4 divide-y divide-border border-t border-border">
                <li v-for="listing in listings.data" :key="listing.id" class="py-3">
                    <Link :href="`${cityBaseUrl}/listings/${listing.id}`" class="flex items-center gap-4 no-underline hover:underline">
                        <div class="w-16 h-16 shrink-0 rounded-token-sm overflow-hidden bg-muted flex items-center justify-center text-muted text-xs">
                            <img v-if="listing.attachments?.length" :src="listing.attachments[0].url" alt="" class="w-full h-full object-cover" />
                            <span v-else>No photo</span>
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="font-medium text-fg truncate">{{ listing.title }}</p>
                            <p class="text-sm text-muted">{{ (listingTypes[listing.type]?.label || listing.type) }} · {{ listing.price != null ? `$${Number(listing.price).toLocaleString()}` : 'Free' }}</p>
                        </div>
                    </Link>
                </li>
            </ul>
            <div v-if="listings.data.length === 0" class="py-12 text-center text-muted">No listings found.</div>
            <gv-pagination
                v-if="listings.prev_page_url || listings.next_page_url"
                variant="block"
                :current-page="listings.current_page"
                :previous-href="listings.prev_page_url || undefined"
                :next-href="listings.next_page_url || undefined"
                :link-component="Link"
                class="govuk-!-margin-top-6"
            />
        </div>
    </CityLayout>
</template>

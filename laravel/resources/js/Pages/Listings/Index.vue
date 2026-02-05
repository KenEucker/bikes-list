<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';
import Footer from '@/Components/Footer.vue';

const props = defineProps({
    city: { type: Object, required: true },
    listings: { type: Object, required: true },
    filters: { type: Object, default: () => ({}) },
    listingTypes: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const form = {
    q: props.filters.q ?? '',
    type: props.filters.type ?? '',
    min_price: props.filters.min_price ?? '',
    max_price: props.filters.max_price ?? '',
};

function search() {
    router.get(route('city.listings.index', props.city.slug), form, { preserveState: true });
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
    <div class="min-h-screen flex flex-col bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="Listings">
            <template #nav-right>
                <Link v-if="$page.props.auth.user" :href="`${cityBaseUrl}/listings/new`" class="rounded-token-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90 underline">New listing</Link>
                <Link v-if="$page.props.auth.user" :href="$page.props.urls?.accountSettings || '/account/settings'" class="text-sm text-muted hover:text-fg underline">Profile</Link>
                <Link v-else :href="$page.props.urls?.signIn || '/account/sign-in'" class="text-sm text-muted hover:text-fg underline">Log in</Link>
            </template>
        </CityNav>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div class="mb-6 flex flex-wrap items-end gap-4 rounded-token-md border border-border bg-card p-4">
                <div class="flex-1 min-w-[120px]">
                    <label class="block text-sm font-medium text-fg">Search</label>
                    <input v-model="form.q" type="text" placeholder="Keywords..." class="mt-1 block w-full rounded-token-md border border-border bg-card text-fg shadow-sm focus:border-primary focus:ring-2 focus:ring-ring-focus" @keyup.enter="search" />
                </div>
                <div class="w-40">
                    <label class="block text-sm font-medium text-fg">Type</label>
                    <select v-model="form.type" class="mt-1 block w-full rounded-token-md border border-border bg-card text-fg focus:border-primary focus:ring-2 focus:ring-ring-focus">
                        <option value="">All</option>
                        <option v-for="(config, key) in listingTypes" :key="key" :value="key">{{ config.label }}</option>
                    </select>
                </div>
                <div class="w-28">
                    <label class="block text-sm font-medium text-fg">Min $</label>
                    <input v-model="form.min_price" type="number" min="0" step="0.01" class="mt-1 block w-full rounded-token-md border border-border bg-card text-fg focus:border-primary focus:ring-2 focus:ring-ring-focus" />
                </div>
                <div class="w-28">
                    <label class="block text-sm font-medium text-fg">Max $</label>
                    <input v-model="form.max_price" type="number" min="0" step="0.01" class="mt-1 block w-full rounded-token-md border border-border bg-card text-fg focus:border-primary focus:ring-2 focus:ring-ring-focus" />
                </div>
                <button type="button" class="rounded-token-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90 focus:ring-2 focus:ring-ring-focus" @click="search">Search</button>
                <Link v-if="$page.props.auth.user" :href="saveSearchUrl()" class="rounded-token-md border border-border bg-card px-4 py-2 text-sm font-medium text-fg hover:bg-page underline">Save search</Link>
            </div>

            <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h1 class="govuk-heading-l">Listings</h1>
                <Link v-if="$page.props.auth.user" :href="`${cityBaseUrl}/listings/new`" class="rounded-token-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90 underline">New listing</Link>
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
        </main>
        <Footer />
    </div>
</template>

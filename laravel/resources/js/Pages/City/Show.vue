<script setup>
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import CityCalendarList from '@/Components/CityCalendarList.vue';
import CityLayout from '@/Layouts/CityLayout.vue';
import ListingCard from '@/Components/ListingCard.vue';
import { computed, ref } from 'vue';

const props = defineProps({
    city: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
    upcomingEvents: { type: Array, default: () => [] },
    featuredPages: { type: Array, default: () => [] },
    listingsPreview: { type: Array, default: () => [] },
});

const page = usePage();
const searchQuery = ref('');

function safeArray(val) {
    if (val == null) return [];
    return Array.isArray(val) ? val : [];
}
// Read from raw page props so we never touch .length on undefined (handles missing/key name mismatch)
const upcomingEventsSafe = computed(() => {
    const p = page.props;
    return safeArray(p.upcomingEvents ?? p.upcoming_events);
});
const featuredPagesSafe = computed(() => safeArray(page.props.featuredPages ?? page.props.featured_pages));
const listingsPreviewSafe = computed(() => safeArray(page.props.listingsPreview ?? page.props.listings_preview));

function submitSearch() {
    const q = searchQuery.value.trim();
    const origin = typeof window !== 'undefined' ? window.location.origin : props.cityBaseUrl;
    const base = origin.replace(/\/$/, '');
    const url = q ? `${base}/search?q=${encodeURIComponent(q)}` : `${base}/search`;
    router.visit(url);
}
</script>

<template>
    <Head :title="city.name" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl">
        <div class="govuk-width-container govuk-!-padding-top-8 govuk-!-padding-bottom-8 space-y-10">
            <h1 class="govuk-heading-xl">{{ city.name }}</h1>
            <p v-if="city.description" class="text-muted">{{ city.description }}</p>

            <!-- 1. Upcoming events (this month) -->
            <section v-if="upcomingEventsSafe.length > 0" class="space-y-4">
                <h2 class="text-xl font-semibold text-fg">Upcoming events this month</h2>
                <CityCalendarList :events="upcomingEventsSafe" />
                <a :href="`${cityBaseUrl}/events`" class="inline-block text-sm text-primary underline">View all events</a>
            </section>

            <!-- 2. Community pages link (above search) -->
            <section class="space-y-2">
                <a :href="`${cityBaseUrl}/community`" class="inline-block text-lg font-medium text-primary underline">Community pages</a>
            </section>

            <!-- 3. Featured community pages -->
            <section v-if="featuredPagesSafe.length > 0" class="space-y-4">
                <h2 class="text-xl font-semibold text-fg">Featured community pages</h2>
                <ul class="grid gap-4 sm:grid-cols-3">
                    <li v-for="p in featuredPagesSafe" :key="p.id">
                        <a
                            :href="`${cityBaseUrl}/community/${p.slug}`"
                            class="block rounded-token-md border border-border bg-card p-4 shadow-sm hover:border-primary hover:shadow underline"
                        >
                            <span class="font-medium text-fg">{{ p.name }}</span>
                        </a>
                    </li>
                </ul>
                <a :href="`${cityBaseUrl}/community`" class="inline-block text-sm text-primary underline">View all community pages</a>
            </section>

            <!-- 4. Search bar -->
            <section class="space-y-2">
                <h2 class="govuk-heading-l">Search</h2>
                <form
                    :action="`${cityBaseUrl}/search`"
                    method="get"
                    class="flex max-w-xl flex-wrap gap-2"
                    @submit.prevent="submitSearch"
                >
                    <div class="min-w-0 flex-1 basis-40">
                        <gv-input
                            id="city-search"
                            v-model="searchQuery"
                            label="Search listings, events, and pages"
                            type="search"
                            placeholder="Search..."
                            autocomplete="off"
                            class="govuk-!-width-full"
                        />
                    </div>
                    <gv-button
                        v-show="searchQuery.trim().length > 0"
                        type="submit"
                        variant="primary"
                        class="shrink-0"
                    >
                        Search
                    </gv-button>
                </form>
            </section>

            <!-- 5. Listings preview (max 20) -->
            <section class="space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <h2 class="text-xl font-semibold text-fg">Listings</h2>
                    <Link v-if="$page.props.auth?.user" :href="`${cityBaseUrl}/listings/new`" class="govuk-button" role="button">New listing</Link>
                </div>
                <ul v-if="listingsPreviewSafe.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <li v-for="listing in listingsPreviewSafe" :key="listing.id">
                        <ListingCard
                            :listing="listing"
                            :url="`${cityBaseUrl}/listings/${listing.id}`"
                            :show-status="false"
                        />
                    </li>
                </ul>
                <p v-else class="text-muted">No listings yet.</p>
                <a :href="`${cityBaseUrl}/listings`" class="inline-block text-sm font-medium text-primary underline">View all listings</a>
            </section>

            <a :href="homeUrl" class="inline-block text-muted underline hover:text-fg">Back to cities</a>
        </div>
    </CityLayout>
</template>

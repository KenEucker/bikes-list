<script setup>
import { Head, router, usePage } from '@inertiajs/vue3';
import CityCalendarList from '@/Components/CityCalendarList.vue';
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
const logo = page.props.logo || '/bikeslist.png';
const appName = page.props.appName || 'BikesList';
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
    <div class="min-h-screen bg-page">
        <nav class="border-b border-border bg-card">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between items-center">
                    <div class="flex items-center gap-6">
                        <a :href="cityBaseUrl" class="flex items-center gap-2 text-xl font-semibold text-fg no-underline">
                            <img :src="logo" :alt="appName" class="h-8 w-auto object-contain" />
                            <span>{{ appName }}</span>
                        </a>
                        <span class="text-muted">/ {{ city.name }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <a v-if="$page.props.auth.user" :href="`${cityBaseUrl}/dashboard`" class="text-sm text-muted hover:text-fg underline">Dashboard</a>
                        <a v-else :href="(usePage().props.urls?.signIn) || '/account/sign-in'" class="text-sm text-muted hover:text-fg underline">Sign in</a>
                    </div>
                </div>
            </div>
        </nav>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
            <h1 class="text-3xl font-bold text-fg">{{ city.name }}</h1>
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
                <h2 class="text-xl font-semibold text-fg">Search</h2>
                <form
                    :action="`${cityBaseUrl}/search`"
                    method="get"
                    class="flex max-w-xl gap-2"
                    @submit.prevent="submitSearch"
                >
                    <input
                        v-model="searchQuery"
                        type="search"
                        name="q"
                        placeholder="Search listings, events, and pages..."
                        class="flex-1 rounded-token-md border border-border bg-input px-4 py-3 text-fg placeholder-muted shadow-sm focus:border-focus focus:ring-focus"
                        autocomplete="off"
                    />
                    <button
                        v-show="searchQuery.trim().length > 0"
                        type="submit"
                        class="rounded-token-md bg-primary px-4 py-3 text-sm font-medium text-primary-fg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                    >
                        Search
                    </button>
                </form>
            </section>

            <!-- 5. Listings preview (max 20) -->
            <section class="space-y-4">
                <h2 class="text-xl font-semibold text-fg">Listings</h2>
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
        </main>
    </div>
</template>

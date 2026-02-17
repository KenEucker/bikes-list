<script setup>
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import CityCalendarList from '@/Components/CityCalendarList.vue';
import CityLayout from '@/Layouts/CityLayout.vue';
import SaleCard from '@/Components/SaleCard.vue';
import { computed, ref } from 'vue';

const props = defineProps({
    city: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
    upcomingRides: { type: Array, default: () => [] },
    featuredPages: { type: Array, default: () => [] },
    salesPreview: { type: Array, default: () => [] },
});

const page = usePage();
const searchQuery = ref('');

function safeArray(val) {
    if (val == null) return [];
    return Array.isArray(val) ? val : [];
}
// Read from raw page props so we never touch .length on undefined (handles missing/key name mismatch)
const upcomingRidesSafe = computed(() => {
    const p = page.props;
    return safeArray(p.upcomingRides ?? p.upcoming_rides);
});
const featuredPagesSafe = computed(() => safeArray(page.props.featuredPages ?? page.props.featured_pages));
const salesPreviewSafe = computed(() => safeArray(page.props.salesPreview ?? page.props.sales_preview));

function submitSearch() {
    const q = searchQuery.value.trim();
    const origin = typeof window !== 'undefined' ? window.location.origin : props.cityBaseUrl;
    const base = origin.replace(/\/$/, '');
    const url = q ? `${base}/search?q=${encodeURIComponent(q)}` : `${base}/search`;
    router.visit(url);
}
</script>

<template>
    <Head :title="`BikesList – ${city.name}`">
        <meta name="description" :content="city.description || `Bike sales, rides, and community in ${city.name}.`">
        <meta property="og:title" :content="`BikesList – ${city.name}`">
        <meta property="og:description" :content="city.description || `Bike sales, rides, and community in ${city.name}.`">
        <meta property="og:url" :content="page.props.seo?.currentUrl || cityBaseUrl">
        <link rel="canonical" :href="page.props.seo?.currentUrl || cityBaseUrl">
    </Head>
    <CityLayout :city="city" :city-base-url="cityBaseUrl">
        <div class="govuk-width-container govuk-!-padding-top-8 govuk-!-padding-bottom-8 space-y-10">
            <h1 class="govuk-heading-xl">{{ city.name }}</h1>
            <p v-if="city.description" class="text-muted">{{ city.description }}</p>

            <!-- 1. Upcoming rides (this month) -->
            <section v-if="upcomingRidesSafe.length > 0" class="space-y-4">
                <h2 class="text-xl font-semibold text-fg">Upcoming rides this month</h2>
                <CityCalendarList :rides="upcomingRidesSafe" />
                <a :href="`${cityBaseUrl}/rides`" class="inline-block text-sm text-primary underline">View all rides</a>
            </section>


            <!-- 2. Featured community pages -->
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

            <!-- 3. Community pages link (above search) -->
            <section v-else class="space-y-2">
                <a :href="`${cityBaseUrl}/community`" class="inline-block text-lg font-medium text-primary underline">Community pages</a>
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
                            label="Search sales, rides, and pages"
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

            <!-- 5. For Sale preview (max 20) -->
            <section class="space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <h2 class="text-xl font-semibold text-fg">For Sale</h2>
                    <Link v-if="$page.props.auth?.user" :href="`${cityBaseUrl}/for-sale/new`" class="govuk-button" role="button">Add new sale</Link>
                </div>
                <div v-if="salesPreviewSafe.length > 0">
                    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <li v-for="sale in salesPreviewSafe" :key="sale.id">
                            <SaleCard
                                :sale="sale"
                                :url="`${cityBaseUrl}/for-sale/${sale.id}`"
                                :show-status="false"
                            />
                        </li>
                    </ul>
                    <a :href="`${cityBaseUrl}/for-sale`" class="inline-block text-sm font-medium text-primary underline">View all for sale</a>
                </div>
                <p v-else class="text-muted">No items for sale yet.</p>
            </section>

            <a :href="homeUrl" class="inline-block text-muted underline hover:text-fg">Back to cities</a>
        </div>
    </CityLayout>
</template>

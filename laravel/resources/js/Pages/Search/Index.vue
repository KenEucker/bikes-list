<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import CityLayout from '@/Layouts/CityLayout.vue';
import ListingCard from '@/Components/ListingCard.vue';
import EventCard from '@/Components/EventCard.vue';
import PageCard from '@/Components/PageCard.vue';

const props = defineProps({
    city: { type: Object, required: true },
    query: { type: String, default: '' },
    tab: { type: String, default: 'listings' },
    listings: { type: Array, default: () => [] },
    events: { type: Array, default: () => [] },
    pages: { type: Array, default: () => [] },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const q = ref(props.query);
const currentTab = ref(props.tab);

function doSearch() {
    router.get(
        `${props.cityBaseUrl}/search`,
        { q: q.value || undefined, tab: currentTab.value },
        { preserveState: true }
    );
}
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Search`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" breadcrumb="Search">
        <template #nav-right>
            <a :href="cityBaseUrl" class="govuk-link">Back to city</a>
        </template>

        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">Search</h1>
            <form class="mt-4 flex flex-wrap gap-2" @submit.prevent="doSearch">
                <div class="min-w-0 flex-1 basis-40">
                    <input
                        v-model="q"
                        type="search"
                        placeholder="Search listings, events, pages..."
                        class="block w-full min-w-0 rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus"
                    />
                </div>
                <button
                    type="submit"
                    class="rounded-token-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90 shrink-0"
                >
                    Search
                </button>
            </form>

            <div class="mt-6 flex gap-4 border-b border-border">
                <button
                    type="button"
                    class="border-b-2 px-2 py-2 text-sm font-medium"
                    :class="currentTab === 'listings' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-fg'"
                    @click="currentTab = 'listings'"
                >
                    Listings
                </button>
                <button
                    type="button"
                    class="border-b-2 px-2 py-2 text-sm font-medium"
                    :class="currentTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-fg'"
                    @click="currentTab = 'events'"
                >
                    Events
                </button>
                <button
                    type="button"
                    class="border-b-2 px-2 py-2 text-sm font-medium"
                    :class="currentTab === 'pages' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-fg'"
                    @click="currentTab = 'pages'"
                >
                    Pages
                </button>
            </div>

            <div class="mt-6">
                <div v-show="currentTab === 'listings'" class="space-y-4">
                    <p v-if="!query" class="text-muted">Enter a search term and click Search.</p>
                    <template v-else>
                        <p class="text-sm text-muted">{{ listings.length }} result(s)</p>
                        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <li v-for="listing in listings" :key="listing.id">
                                <ListingCard
                                    :listing="listing"
                                    :url="`${cityBaseUrl}/listings/${listing.id}`"
                                    :show-status="false"
                                />
                            </li>
                        </ul>
                    </template>
                </div>
                <div v-show="currentTab === 'events'" class="space-y-4">
                    <p v-if="!query" class="text-muted">Enter a search term and click Search.</p>
                    <template v-else>
                        <p class="text-sm text-muted">{{ events.length }} result(s)</p>
                        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <li v-for="event in events" :key="event.id">
                                <EventCard
                                    :event="event"
                                    :url="`${cityBaseUrl}/events/${event.id}`"
                                    :show-status="false"
                                />
                            </li>
                        </ul>
                    </template>
                </div>
                <div v-show="currentTab === 'pages'" class="space-y-4">
                    <p v-if="!query" class="text-muted">Enter a search term and click Search.</p>
                    <template v-else>
                        <p class="text-sm text-muted">{{ pages.length }} result(s)</p>
                        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <li v-for="page in pages" :key="page.id">
                                <PageCard
                                    :page="page"
                                    :url="`${cityBaseUrl}/community/${page.slug}`"
                                    :show-status="false"
                                />
                            </li>
                        </ul>
                    </template>
                </div>
            </div>
        </div>
    </CityLayout>
</template>

<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import CityNav from '@/Components/CityNav.vue';
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
    <Head :title="`Search – ${city.name}`" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="Search">
            <template #nav-right>
                <a :href="cityBaseUrl" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Back to city</a>
            </template>
        </CityNav>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Search</h1>
            <form class="mt-4 flex gap-2" @submit.prevent="doSearch">
                <input
                    v-model="q"
                    type="search"
                    placeholder="Search listings, events, pages..."
                    class="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button
                    type="submit"
                    class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Search
                </button>
            </form>

            <div class="mt-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
                <button
                    type="button"
                    class="border-b-2 px-2 py-2 text-sm font-medium"
                    :class="currentTab === 'listings' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
                    @click="currentTab = 'listings'"
                >
                    Listings
                </button>
                <button
                    type="button"
                    class="border-b-2 px-2 py-2 text-sm font-medium"
                    :class="currentTab === 'events' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
                    @click="currentTab = 'events'"
                >
                    Events
                </button>
                <button
                    type="button"
                    class="border-b-2 px-2 py-2 text-sm font-medium"
                    :class="currentTab === 'pages' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
                    @click="currentTab = 'pages'"
                >
                    Pages
                </button>
            </div>

            <div class="mt-6">
                <div v-show="currentTab === 'listings'" class="space-y-4">
                    <p v-if="!query" class="text-gray-500 dark:text-gray-400">Enter a search term and click Search.</p>
                    <template v-else>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ listings.length }} result(s)</p>
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
                    <p v-if="!query" class="text-gray-500 dark:text-gray-400">Enter a search term and click Search.</p>
                    <template v-else>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ events.length }} result(s)</p>
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
                    <p v-if="!query" class="text-gray-500 dark:text-gray-400">Enter a search term and click Search.</p>
                    <template v-else>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ pages.length }} result(s)</p>
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
        </main>
    </div>
</template>

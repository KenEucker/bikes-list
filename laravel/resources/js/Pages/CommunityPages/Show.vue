<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';
import ReportBlock from '@/Components/ReportBlock.vue';

defineProps({
    city: { type: Object, required: true },
    communityPage: { type: Object, required: true },
    moderatorRelayEmail: { type: String, default: '' },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="communityPage.name" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CityNav :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Community pages', communityPage.name]">
            <template #nav-right>
                <a :href="`${cityBaseUrl}/community`" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Back to community</a>
                <Link v-if="$page.props.auth.user && communityPage.managers?.some(m => m.id === $page.props.auth.user.id)" :href="`${cityBaseUrl}/community/${communityPage.slug}/edit`" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Edit</Link>
            </template>
        </CityNav>

        <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ communityPage.name }}</h1>
            <div v-if="communityPage.about" class="mt-4 prose dark:prose-invert max-w-none">
                <h2 class="text-lg font-semibold">About</h2>
                <p class="whitespace-pre-wrap">{{ communityPage.about }}</p>
            </div>
            <div v-if="communityPage.event_info" class="mt-6 prose dark:prose-invert max-w-none">
                <h2 class="text-lg font-semibold">Event info</h2>
                <p class="whitespace-pre-wrap">{{ communityPage.event_info }}</p>
            </div>
            <div v-if="communityPage.sales_info" class="mt-6 prose dark:prose-invert max-w-none">
                <h2 class="text-lg font-semibold">Sales info</h2>
                <p class="whitespace-pre-wrap">{{ communityPage.sales_info }}</p>
            </div>
            <div v-if="communityPage.contact_address || communityPage.contact_email || communityPage.contact_phone" class="mt-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Contact</h2>
                <p v-if="communityPage.contact_address" class="text-gray-600 dark:text-gray-400">{{ communityPage.contact_address }}</p>
                <p v-if="communityPage.contact_email" class="text-gray-600 dark:text-gray-400">{{ communityPage.contact_email }}</p>
                <p v-if="communityPage.contact_phone" class="text-gray-600 dark:text-gray-400">{{ communityPage.contact_phone }}</p>
            </div>
            <section v-if="communityPage.listings?.length" class="mt-8">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Listings</h2>
                <ul class="mt-2 space-y-2">
                    <li v-for="listing in communityPage.listings" :key="listing.id">
                        <a :href="`${cityBaseUrl}/listings/${listing.id}`" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">{{ listing.title }}</a>
                    </li>
                </ul>
                <a :href="`${cityBaseUrl}/listings?type=`" class="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">View all listings from this page</a>
            </section>
            <section v-if="communityPage.events?.length" class="mt-8">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Events</h2>
                <ul class="mt-2 space-y-2">
                    <li v-for="event in communityPage.events" :key="event.id">
                        <a :href="`${cityBaseUrl}/events/${event.id}`" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">{{ event.title }}</a>
                        <span class="text-sm text-gray-500 dark:text-gray-400"> – {{ new Date(event.starts_at).toLocaleDateString() }}</span>
                    </li>
                </ul>
            </section>
            <div v-if="moderatorRelayEmail" class="mt-8">
                <ReportBlock
                    :moderator-relay-email="moderatorRelayEmail"
                    item-type="Page"
                    :item-title="communityPage.name"
                    :item-id-or-slug="communityPage.slug"
                />
            </div>

            <div v-if="$page.props.auth.user && !communityPage.managers?.some(m => m.id === $page.props.auth.user.id)" class="mt-8 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Claim this page</p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">If you represent this organization, you can request to manage this page.</p>
                <a :href="`${cityBaseUrl}/community/${communityPage.slug}/claim`" class="mt-2 inline-block rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">Claim this page</a>
            </div>
        </main>
    </div>
</template>

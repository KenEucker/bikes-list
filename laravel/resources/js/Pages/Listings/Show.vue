<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';
import RelayEmailBlock from '@/Components/RelayEmailBlock.vue';
import ReportBlock from '@/Components/ReportBlock.vue';

const props = defineProps({
    city: { type: Object, required: true },
    listing: { type: Object, required: true },
    relayEmailAddress: { type: String, default: null },
    moderatorRelayEmail: { type: String, default: '' },
    bikeIndexUrl: { type: String, default: 'https://bikeindex.org/search' },
    listingTypes: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const typeLabel = props.listingTypes[props.listing.type]?.label ?? props.listing.type;
const mailtoSubject = `Re: Listing – ${props.listing.title} – ${props.listing.id}`;
</script>

<template>
    <Head :title="listing.title" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CityNav :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Listings', listing.title]">
            <template #nav-right>
                <a :href="`${cityBaseUrl}/listings`" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Back to listings</a>
                <Link v-if="$page.props.auth.user" :href="$page.props.urls?.accountSettings || '/account/settings'" class="text-sm text-gray-600 dark:text-gray-400 dark:hover:text-white">Account</Link>
                <Link v-else :href="$page.props.urls?.signIn || '/account/sign-in'" class="text-sm text-gray-600 dark:text-gray-400 dark:hover:text-white">Sign in</Link>
            </template>
        </CityNav>

        <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ listing.title }}</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ typeLabel }} · {{ listing.price != null ? `$${Number(listing.price).toLocaleString()}` : 'Free' }}</p>

            <div v-if="listing.attachments?.length" class="mt-4 flex gap-2 overflow-x-auto">
                <img v-for="att in listing.attachments" :key="att.id" :src="att.url" :alt="att.original_name" class="h-48 w-auto rounded object-cover" />
            </div>
            <div v-else class="mt-4 aspect-video rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">No photos</div>

            <div class="mt-6 prose dark:prose-invert max-w-none">
                <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ listing.description }}</p>
            </div>

            <div v-if="relayEmailAddress" class="mt-8">
                <RelayEmailBlock
                    :email="relayEmailAddress"
                    label="Contact seller"
                    :mailto-subject="mailtoSubject"
                />
            </div>

            <section v-if="listing.type === 'full_bicycle'" class="mt-8 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Stolen bike check</h2>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Check if a bike has been reported stolen before buying.</p>
                <a :href="bikeIndexUrl" target="_blank" rel="noopener noreferrer" class="mt-2 inline-block text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Search on Bike Index</a>
            </section>

            <div v-if="moderatorRelayEmail" class="mt-8">
                <ReportBlock
                    :moderator-relay-email="moderatorRelayEmail"
                    item-type="Listing"
                    :item-title="listing.title"
                    :item-id-or-slug="listing.id"
                />
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
                <Link v-if="$page.props.auth.user && (listing.user_id === $page.props.auth.user.id || listing.community_page_id)" :href="`${cityBaseUrl}/listings/${listing.id}/edit`" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">Edit</Link>
                <template v-if="$page.props.auth.user && (listing.user_id === $page.props.auth.user.id || listing.community_page_id)">
                    <Link v-if="listing.state === 'published'" :href="`${cityBaseUrl}/listings/${listing.id}/sold`" method="post" as="button" class="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">Mark sold</Link>
                </template>
            </div>
        </main>
    </div>
</template>

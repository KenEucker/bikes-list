<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import CityLayout from '@/Layouts/CityLayout.vue';
import EmailRelayCard from '@/Components/EmailRelayCard.vue';
import PendingReviewBanner from '@/Components/PendingReviewBanner.vue';

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

const page = usePage();
const status = computed(() => page.props.status ?? page.props.flash?.status);
const error = computed(() => page.props.flash?.error);

const typeLabel = props.listingTypes[props.listing.type]?.label ?? props.listing.type;
const mailtoSubject = `Re: Listing – ${props.listing.title} – ${props.listing.id}`;
</script>

<template>
    <Head :title="`BikesList – ${listing.title}`">
        <meta name="description" :content="listing.description ? listing.description.slice(0, 160) : `${listing.title} – bike listing in ${city.name}.`">
        <meta property="og:title" :content="`BikesList – ${listing.title}`">
        <meta property="og:description" :content="listing.description ? listing.description.slice(0, 160) : `${listing.title} – bike listing in ${city.name}.`">
        <meta property="og:url" :content="page.props.seo?.currentUrl || `${cityBaseUrl}/listings/${listing.id}`">
        <link rel="canonical" :href="page.props.seo?.currentUrl || `${cityBaseUrl}/listings/${listing.id}`">
    </Head>
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Listings', listing.title]">
            <template #nav-right>
                <a :href="`${cityBaseUrl}/listings`" class="govuk-link">Back to listings</a>
                <Link v-if="$page.props.auth.user" :href="$page.props.urls?.accountSettings || '/account/settings'" class="govuk-link">Account</Link>
                <Link v-else :href="$page.props.urls?.signIn || '/account/sign-in'" class="govuk-link">Sign in</Link>
            </template>

            <gv-notification-banner v-if="status" type="success" title="Success" class="rounded-none border-x-0 border-t-0">
                <p class="govuk-body">{{ status }}</p>
            </gv-notification-banner>
            <PendingReviewBanner :show="listing.state === 'pending_review'" resource-label="listing" />
            <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <gv-notification-banner v-if="error" title="Error" class="mb-6">
                    <p class="govuk-body">{{ error }}</p>
                </gv-notification-banner>
            <h1 class="text-2xl font-bold text-fg">{{ listing.title }}</h1>
            <p class="mt-1 text-sm text-muted">{{ typeLabel }} · {{ listing.price != null ? `$${Number(listing.price).toLocaleString()}` : 'Free' }}</p>

            <div v-if="listing.uploads?.length" class="mt-4 flex gap-2 overflow-x-auto">
                <template v-for="u in listing.uploads" :key="u.id">
                    <img v-if="u.status === 'ready' && u.lg_url" :src="u.lg_url" :alt="'Photo'" class="h-48 w-auto rounded object-cover" />
                    <div v-else class="h-48 w-48 shrink-0 rounded bg-muted/30 flex items-center justify-center text-muted text-sm">Processing…</div>
                </template>
            </div>
            <div v-else-if="listing.attachments?.length" class="mt-4 flex gap-2 overflow-x-auto">
                <img v-for="att in listing.attachments" :key="att.id" :src="att.url" :alt="att.original_name" class="h-48 w-auto rounded object-cover" />
            </div>
            <div v-else class="mt-4 aspect-video rounded bg-muted/30 flex items-center justify-center text-muted">No photos</div>

            <div class="mt-6 prose dark:prose-invert max-w-none">
                <p class="whitespace-pre-wrap text-fg">{{ listing.description }}</p>
            </div>

            <div v-if="relayEmailAddress" class="mt-8">
                <EmailRelayCard
                    :email="relayEmailAddress"
                    label="Contact seller"
                    note="Copy the address below and use your own email client. Your address is never shown to the recipient."
                    :mailto-subject="mailtoSubject"
                />
            </div>

            <section v-if="listing.type === 'full_bicycle'" class="mt-8 rounded-token-md border border-border bg-card p-4">
                <h2 class="text-lg font-semibold text-fg">Stolen bike check</h2>
                <p class="mt-1 text-sm text-muted">Check if a bike has been reported stolen before buying.</p>
                <a :href="bikeIndexUrl" target="_blank" rel="noopener noreferrer" class="mt-2 inline-block text-primary underline">Search on Bike Index</a>
            </section>

            <div v-if="moderatorRelayEmail" class="mt-8">
                <EmailRelayCard
                    :email="moderatorRelayEmail"
                    label="Report this listing"
                    note="Email the city moderators. Include the subject so they can identify the item."
                    :mailto-subject="`Report: Listing – ${listing.title} – ${listing.id}`"
                />
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
                <Link v-if="$page.props.auth.user && (listing.user_id === $page.props.auth.user.id || listing.community_page_id)" :href="`${cityBaseUrl}/listings/${listing.id}/edit`" class="rounded-token-md border border-border bg-card px-4 py-2 text-sm font-medium text-fg hover:opacity-90">Edit</Link>
                <template v-if="$page.props.auth.user && (listing.user_id === $page.props.auth.user.id || listing.community_page_id)">
                    <Link v-if="listing.state === 'published'" :href="`${cityBaseUrl}/listings/${listing.id}/sold`" method="post" as="button" class="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">Mark sold</Link>
                </template>
            </div>
        </div>
    </CityLayout>
</template>

<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import CityLayout from '@/Layouts/CityLayout.vue';
import EmailRelayCard from '@/Components/EmailRelayCard.vue';
import PendingReviewBanner from '@/Components/PendingReviewBanner.vue';

defineProps({
    city: { type: Object, required: true },
    communityPage: { type: Object, required: true },
    moderatorRelayEmail: { type: String, default: '' },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const page = usePage();
const status = computed(() => page.props.status ?? page.props.flash?.status);
</script>

<template>
    <Head :title="`BikesList – ${communityPage.name}`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Community pages', communityPage.name]">
        <template #nav-right>
            <a :href="`${cityBaseUrl}/community`" class="govuk-link">Back to community</a>
            <Link v-if="$page.props.auth.user && communityPage.managers?.some(m => m.id === $page.props.auth.user.id)" :href="`${cityBaseUrl}/community/${communityPage.slug}/edit`" class="govuk-link">Edit</Link>
        </template>

        <PendingReviewBanner :show="communityPage.state === 'pending'" resource-label="page" />
        <gv-notification-banner v-if="status" type="success" title="Success" class="rounded-none border-x-0 border-t-0">
            <p class="govuk-body">{{ status }}</p>
        </gv-notification-banner>
        <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">{{ communityPage.name }}</h1>
            <img v-if="communityPage.uploads?.length && communityPage.uploads[0].lg_url" :src="communityPage.uploads[0].lg_url" alt="" class="mt-4 max-h-64 w-full object-cover rounded">
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
                <h2 class="text-lg font-semibold text-fg">Contact</h2>
                <p v-if="communityPage.contact_address" class="text-muted">{{ communityPage.contact_address }}</p>
                <p v-if="communityPage.contact_email" class="text-muted">{{ communityPage.contact_email }}</p>
                <p v-if="communityPage.contact_phone" class="text-muted">{{ communityPage.contact_phone }}</p>
            </div>
            <section v-if="communityPage.listings?.length" class="mt-8">
                <h2 class="text-lg font-semibold text-fg">Listings</h2>
                <ul class="mt-2 space-y-2">
                    <li v-for="listing in communityPage.listings" :key="listing.id">
                        <a :href="`${cityBaseUrl}/listings/${listing.id}`" class="text-primary underline">{{ listing.title }}</a>
                    </li>
                </ul>
                <a :href="`${cityBaseUrl}/listings?type=`" class="mt-2 inline-block text-sm text-primary underline">View all listings from this page</a>
            </section>
            <section v-if="communityPage.events?.length" class="mt-8">
                <h2 class="text-lg font-semibold text-fg">Events</h2>
                <ul class="mt-2 space-y-2">
                    <li v-for="event in communityPage.events" :key="event.id">
                        <a :href="`${cityBaseUrl}/events/${event.id}`" class="text-primary underline">{{ event.name }}</a>
                        <span class="text-sm text-muted"> – {{ new Date(event.starts_at).toLocaleDateString() }}</span>
                    </li>
                </ul>
            </section>
            <div v-if="moderatorRelayEmail" class="mt-8">
                <EmailRelayCard
                    :email="moderatorRelayEmail"
                    label="Report this page"
                    note="Email the city moderators. Include the subject so they can identify the item."
                    :mailto-subject="`Report: Page – ${communityPage.name} – ${communityPage.slug}`"
                />
            </div>

            <div v-if="$page.props.auth.user && !communityPage.managers?.some(m => m.id === $page.props.auth.user.id)" class="mt-8 rounded-token-md border border-border bg-card p-4">
                <p class="text-sm font-medium text-fg">Claim this page</p>
                <p class="mt-1 text-sm text-muted">If you represent this organization, you can request to manage this page.</p>
                <a :href="`${cityBaseUrl}/community/${communityPage.slug}/claim`" class="mt-2 inline-block rounded-token-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90 underline">Claim this page</a>
            </div>
        </div>
    </CityLayout>
</template>

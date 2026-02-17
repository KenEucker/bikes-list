<script setup>
import { Head, Link, usePage, router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import CityLayout from '@/Layouts/CityLayout.vue';
import EmailRelayCard from '@/Components/EmailRelayCard.vue';
import PendingReviewBanner from '@/Components/PendingReviewBanner.vue';

const props = defineProps({
    city: { type: Object, required: true },
    sale: { type: Object, required: true },
    /** Serial number to show (only set when not private). Use this instead of sale.serial_number. */
    serial_number_display: { type: String, default: null },
    relayEmailAddress: { type: String, default: null },
    bikeIndexUrl: { type: String, default: 'https://bikeindex.org/search' },
    saleTypes: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const page = usePage();
const status = computed(() => page.props.status ?? page.props.flash?.status);
const error = computed(() => page.props.flash?.error);
const flagSubmitting = ref(false);

const typeLabel = props.saleTypes[props.sale.type]?.label ?? props.sale.type;
const mailtoSubject = `Re: Sale – ${props.sale.title} – ${props.sale.id}`;

const opts = computed(() => props.saleTypes?.full_bicycle_options ?? {});
const conditions = computed(() => props.saleTypes?.conditions ?? {});

const postingDetailsRows = computed(() => {
    const s = props.sale;
    const rows = [];
    const add = (key, label, value) => {
        if (value != null && String(value).trim() !== '') rows.push({ key, label, value: String(value).trim() });
    };
    add('frame_size', 'Frame size', s.frame_size);
    add('make', 'Make', s.make);
    add('model', 'Model', s.model);
    add('serial_number', 'Serial number', props.serial_number_display ?? null);
    add('bicycle_type', 'Bicycle type', opts.value.bicycle_type?.[s.bicycle_type] ?? s.bicycle_type);
    add('wheel_size', 'Wheel size', opts.value.wheel_size?.[s.wheel_size] ?? s.wheel_size);
    add('frame_material', 'Frame material', opts.value.frame_material?.[s.frame_material] ?? s.frame_material);
    add('suspension', 'Suspension', opts.value.suspension?.[s.suspension] ?? s.suspension);
    add('handlebar_type', 'Handlebar type', opts.value.handlebar_type?.[s.handlebar_type] ?? s.handlebar_type);
    add('electric_assist', 'Electric assist', opts.value.electric_assist?.[s.electric_assist] ?? s.electric_assist);
    add('condition', 'Condition', conditions.value[s.condition] ?? s.condition);
    return rows;
});

const flagUrl = `${props.cityBaseUrl}/for-sale/${props.sale.id}/flag`;
function submitFlag() {
    flagSubmitting.value = true;
    router.post(flagUrl, {}, { preserveScroll: true, onFinish: () => { flagSubmitting.value = false; } });
}
</script>

<template>
    <Head :title="`BikesList – ${sale.title}`">
        <meta name="description" :content="sale.description ? sale.description.slice(0, 160) : `${sale.title} – bike for sale in ${city.name}.`">
        <meta property="og:title" :content="`BikesList – ${sale.title}`">
        <meta property="og:description" :content="sale.description ? sale.description.slice(0, 160) : `${sale.title} – bike for sale in ${city.name}.`">
        <meta property="og:url" :content="page.props.seo?.currentUrl || `${cityBaseUrl}/for-sale/${sale.id}`">
        <link rel="canonical" :href="page.props.seo?.currentUrl || `${cityBaseUrl}/for-sale/${sale.id}`">
    </Head>
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="[{ label: 'For Sale', href: `${cityBaseUrl}/for-sale` }, sale.title]">

            <gv-notification-banner v-if="status" type="success" title="Success" class="banner-notice border-t-0 rounded-none border-x-0 text-fg">
                <p class="govuk-body text-fg">{{ status }}</p>
            </gv-notification-banner>
            <PendingReviewBanner :show="sale.state === 'pending_review'" resource-label="sale" />
            <div class="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
                <gv-notification-banner v-if="error" title="Error" class="banner-notice mb-6 text-fg">
                    <p class="govuk-body text-fg">{{ error }}</p>
                </gv-notification-banner>

            <div v-if="relayEmailAddress" class="mb-4">
                <EmailRelayCard
                    :email="relayEmailAddress"
                    label="Contact seller"
                    note="Copy the address below and use your own email client. Your address is never shown to the recipient."
                    :mailto-subject="mailtoSubject"
                />
            </div>

            <h1 class="text-2xl font-bold text-fg">{{ sale.title }}</h1>
            <p class="mt-1 text-sm text-muted">{{ typeLabel }} · {{ sale.price != null ? `$${Number(sale.price).toLocaleString()}` : 'Free' }}</p>

            <div v-if="sale.uploads?.length" class="flex gap-2 mt-4 overflow-x-auto">
                <template v-for="u in sale.uploads" :key="u.id">
                    <img v-if="u.status === 'ready' && u.lg_url" :src="u.lg_url" :alt="'Photo'" class="object-cover w-auto h-48 rounded" />
                    <div v-else class="flex items-center justify-center w-48 h-48 text-sm rounded shrink-0 bg-muted/30 text-muted">Processing…</div>
                </template>
            </div>
            <div v-else-if="sale.attachments?.length" class="flex gap-2 mt-4 overflow-x-auto">
                <img v-for="att in sale.attachments" :key="att.id" :src="att.url" :alt="att.original_name" class="object-cover w-auto h-48 rounded" />
            </div>
            <div v-else class="flex items-center justify-center mt-4 rounded aspect-video bg-muted/30 text-muted">No photos</div>

            <div class="mt-6 prose dark:prose-invert max-w-none">
                <p class="whitespace-pre-wrap text-fg">{{ sale.description }}</p>
            </div>

            <section v-if="sale.type === 'full_bicycle' && postingDetailsRows.length" class="mt-8 govuk-!-padding-4 border border-border rounded-token-md bg-card">
                <h2 class="govuk-heading-m govuk-!-margin-top-0">Posting details</h2>
                <dl class="govuk-summary-list govuk-summary-list--no-border govuk-!-margin-bottom-0">
                    <div v-for="row in postingDetailsRows" :key="row.key" class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key govuk-!-width-one-third">{{ row.label }}</dt>
                        <dd class="govuk-summary-list__value">{{ row.value }}</dd>
                    </div>
                </dl>
            </section>

            <section v-if="sale.type === 'full_bicycle'" class="p-4 mt-8 border rounded-token-md border-border bg-card">
                <h2 class="text-lg font-semibold text-fg">Stolen bike check</h2>
                <p class="mt-1 text-sm text-muted">Check if a bike has been reported stolen before buying.</p>
                <a :href="bikeIndexUrl" target="_blank" rel="noopener noreferrer" class="inline-block mt-2 underline text-primary">Search on Bike Index</a>
            </section>

            <section class="p-4 mt-8 border rounded-token-md border-border bg-card">
                <h2 class="text-lg font-semibold text-fg">Flag this listing</h2>
                <p class="mt-1 text-sm text-muted">Something wrong with this listing? Flag it and moderators will review it. You don’t need an account.</p>
                <form @submit.prevent="submitFlag" class="mt-3">
                    <button
                        type="submit"
                        class="px-4 py-2 text-sm font-medium border rounded-token-md border-border bg-card text-fg hover:opacity-90 disabled:opacity-50"
                        :disabled="flagSubmitting"
                    >
                        {{ flagSubmitting ? 'Submitting…' : 'Flag this listing' }}
                    </button>
                </form>
            </section>

            <div class="flex flex-wrap gap-3 mt-8">
                <Link v-if="$page.props.auth.user && (sale.user_id === $page.props.auth.user.id || sale.community_page_id)" :href="`${cityBaseUrl}/for-sale/${sale.id}/edit`" class="px-4 py-2 text-sm font-medium border rounded-token-md border-border bg-card text-fg hover:opacity-90">Edit</Link>
                <template v-if="$page.props.auth.user && (sale.user_id === $page.props.auth.user.id || sale.community_page_id)">
                    <Link v-if="sale.state === 'published'" :href="`${cityBaseUrl}/for-sale/${sale.id}/sold`" method="post" as="button" class="px-4 py-2 text-sm font-medium text-white rounded-md bg-amber-600 hover:bg-amber-700">Mark sold</Link>
                </template>
            </div>
        </div>
    </CityLayout>
</template>

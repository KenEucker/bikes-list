<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import ModerationQueue from '@/Components/ModerationQueue.vue';
import { ref } from 'vue';

const props = defineProps({
    city: { type: Object, required: true },
    pendingSales: { type: Object, required: true },
    flaggedSales: { type: Object, required: true },
    publishedSales: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
    reasonCodes: { type: Object, default: () => ({}) },
});

const tab = ref('pending');
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Moderation – For Sale`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Moderation', 'For Sale']">
        <template #nav-right>
            <gv-header-navigation-item :href="`${cityBaseUrl}/moderation`" text="Back to moderation" />
        </template>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Sales queue</h1>
            <p class="mt-2 text-sm text-muted">Approve/publish, revert to draft, or remove. Every action requires a reason code.</p>

            <ul class="govuk-tabs__list mt-4">
                <li class="govuk-tabs__list-item" :class="{ 'govuk-tabs__list-item--selected': tab === 'pending' }">
                    <button class="govuk-tabs__tab" type="button" @click="tab = 'pending'">Pending review</button>
                </li>
                <li class="govuk-tabs__list-item" :class="{ 'govuk-tabs__list-item--selected': tab === 'published' }">
                    <button class="govuk-tabs__tab" type="button" @click="tab = 'published'">Published</button>
                </li>
                <li class="govuk-tabs__list-item" :class="{ 'govuk-tabs__list-item--selected': tab === 'flagged' }">
                    <button class="govuk-tabs__tab" type="button" @click="tab = 'flagged'">Flagged</button>
                </li>
            </ul>

            <section v-show="tab === 'pending'" class="govuk-tabs__panel pt-4">
                <h2 class="govuk-heading-m">Pending review</h2>
                <ModerationQueue
                    :items="pendingSales.data || []"
                    entity-label="sales"
                    title-key="title"
                    :show-url-fn="(item) => `${cityBaseUrl}/for-sale/${item.id}`"
                    :approve-url-fn="(item) => `${cityBaseUrl}/moderation/sales/${item.id}/approve`"
                    :revert-url-fn="null"
                    :remove-url-fn="(item) => `${cityBaseUrl}/moderation/sales/${item.id}/remove`"
                    :subtitle-fn="(item) => `By ${item.user?.name ?? 'Unknown'}`"
                    status-value="pending_review"
                    empty-message="No pending sales."
                    :confirm-remove="true"
                    :reason-codes="reasonCodes"
                />
                <nav v-if="pendingSales.next_page_url" class="mt-4">
                    <Link :href="pendingSales.next_page_url" class="govuk-link">Next page</Link>
                </nav>
            </section>

            <section v-show="tab === 'published'" class="govuk-tabs__panel pt-4">
                <h2 class="govuk-heading-m">Published (ongoing moderation)</h2>
                <ModerationQueue
                    :items="publishedSales.data || []"
                    entity-label="sales"
                    title-key="title"
                    :show-url-fn="(item) => `${cityBaseUrl}/for-sale/${item.id}`"
                    :approve-url-fn="null"
                    :revert-url-fn="(item) => `${cityBaseUrl}/moderation/sales/${item.id}/revert`"
                    :remove-url-fn="(item) => `${cityBaseUrl}/moderation/sales/${item.id}/remove`"
                    :subtitle-fn="(item) => `By ${item.user?.name ?? 'Unknown'}`"
                    status-value="published"
                    empty-message="No published sales."
                    :reason-codes="reasonCodes"
                />
                <nav v-if="publishedSales.next_page_url" class="mt-4">
                    <Link :href="publishedSales.next_page_url" class="govuk-link">Next page</Link>
                </nav>
            </section>

            <section v-show="tab === 'flagged'" class="govuk-tabs__panel pt-4">
                <h2 class="govuk-heading-m">Flagged by users</h2>
                <ModerationQueue
                    :items="flaggedSales.data || []"
                    entity-label="sales"
                    title-key="title"
                    :show-url-fn="(item) => `${cityBaseUrl}/for-sale/${item.id}`"
                    :approve-url-fn="null"
                    :revert-url-fn="(item) => `${cityBaseUrl}/moderation/sales/${item.id}/revert`"
                    :remove-url-fn="(item) => `${cityBaseUrl}/moderation/sales/${item.id}/remove`"
                    :subtitle-fn="(item) => `By ${item.user?.name ?? 'Unknown'} · ${item.flags_count ?? 0} flag(s)`"
                    status-value="published"
                    empty-message="No flagged sales."
                    :confirm-remove="true"
                    :reason-codes="reasonCodes"
                />
                <nav v-if="flaggedSales.next_page_url" class="mt-4">
                    <Link :href="flaggedSales.next_page_url" class="govuk-link">Next page</Link>
                </nav>
            </section>
        </main>
    </CityLayout>
</template>

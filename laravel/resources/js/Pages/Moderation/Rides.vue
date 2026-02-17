<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import ModerationQueue from '@/Components/ModerationQueue.vue';
import { ref } from 'vue';

const props = defineProps({
    city: { type: Object, required: true },
    pendingRides: { type: Object, required: true },
    publishedRides: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
    reasonCodes: { type: Object, default: () => ({}) },
});

const tab = ref('pending');
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Moderation – Rides`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Moderation', 'Rides']">
        <template #nav-right>
            <gv-header-navigation-item :href="`${cityBaseUrl}/moderation`" text="Back to moderation" />
        </template>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Rides queue</h1>
            <p class="mt-2 text-sm text-muted">Approve, revert to draft, or remove. Published rides remain visible here for ongoing moderation.</p>

            <ul class="govuk-tabs__list mt-4">
                <li class="govuk-tabs__list-item" :class="{ 'govuk-tabs__list-item--selected': tab === 'pending' }">
                    <button class="govuk-tabs__tab" type="button" @click="tab = 'pending'">Pending review</button>
                </li>
                <li class="govuk-tabs__list-item" :class="{ 'govuk-tabs__list-item--selected': tab === 'published' }">
                    <button class="govuk-tabs__tab" type="button" @click="tab = 'published'">Published</button>
                </li>
            </ul>

            <section v-show="tab === 'pending'" class="govuk-tabs__panel pt-4">
                <h2 class="govuk-heading-m">Pending review</h2>
                <ModerationQueue
                    :items="pendingRides.data || []"
                    entity-label="rides"
                    title-key="name"
                    :show-url-fn="(item) => `${cityBaseUrl}/rides/${item.id}`"
                    :approve-url-fn="(item) => `${cityBaseUrl}/moderation/rides/${item.id}/approve`"
                    :revert-url-fn="null"
                    :remove-url-fn="(item) => `${cityBaseUrl}/moderation/rides/${item.id}/remove`"
                    :subtitle-fn="(item) => `By ${item.user?.name ?? 'Unknown'}`"
                    status-value="pending_review"
                    empty-message="No pending rides."
                    :confirm-remove="true"
                    :reason-codes="reasonCodes"
                />
                <nav v-if="pendingRides.next_page_url" class="mt-4">
                    <Link :href="pendingRides.next_page_url" class="govuk-link">Next page</Link>
                </nav>
            </section>

            <section v-show="tab === 'published'" class="govuk-tabs__panel pt-4">
                <h2 class="govuk-heading-m">Published (ongoing moderation)</h2>
                <ModerationQueue
                    :items="publishedRides.data || []"
                    entity-label="rides"
                    title-key="name"
                    :show-url-fn="(item) => `${cityBaseUrl}/rides/${item.id}`"
                    :approve-url-fn="null"
                    :revert-url-fn="(item) => `${cityBaseUrl}/moderation/rides/${item.id}/revert`"
                    :remove-url-fn="(item) => `${cityBaseUrl}/moderation/rides/${item.id}/remove`"
                    :subtitle-fn="(item) => `By ${item.user?.name ?? 'Unknown'}`"
                    status-value="published"
                    empty-message="No published rides in queue."
                    :confirm-remove="true"
                    :reason-codes="reasonCodes"
                />
                <nav v-if="publishedRides.next_page_url" class="mt-4">
                    <Link :href="publishedRides.next_page_url" class="govuk-link">Next page</Link>
                </nav>
            </section>
        </main>
    </CityLayout>
</template>

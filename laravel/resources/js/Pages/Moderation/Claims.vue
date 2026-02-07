<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';

const props = defineProps({
    city: { type: Object, required: true },
    claims: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
    reasonCodes: { type: Object, default: () => ({}) },
});
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Moderation – Claim requests`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Moderation', 'Claim requests']">
        <template #nav-right>
            <gv-header-navigation-item :href="`${cityBaseUrl}/moderation`" text="Back to moderation" />
        </template>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Claim requests</h1>
            <p class="mt-2 text-sm text-muted">Approve or reject community page claim requests. Every action requires a reason code.</p>

            <ul class="mt-6 space-y-4">
                <li v-for="claim in (claims.data || [])" :key="claim.id" class="rounded-token-md border border-border bg-card p-4">
                    <p class="font-medium">
                        <Link :href="`${cityBaseUrl}/community/${claim.community_page?.slug}`" class="text-primary underline">{{ claim.community_page?.name }}</Link>
                    </p>
                    <p class="mt-1 text-sm text-muted">Claimed by {{ claim.user?.name ?? 'Unknown' }}</p>
                    <p v-if="claim.message" class="mt-2 text-sm">{{ claim.message }}</p>
                    <div class="mt-3 flex flex-wrap gap-2 items-end">
                        <form :action="`${cityBaseUrl}/moderation/claims/${claim.id}/approve`" method="post" class="inline-flex flex-wrap gap-2 items-end">
                            <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                            <div class="govuk-form-group govuk-!-margin-bottom-0">
                                <label class="govuk-label govuk-label--s">Reason code</label>
                                <select name="reason_code" class="govuk-select govuk-!-width-auto" required>
                                    <option v-for="(label, code) in reasonCodes" :key="code" :value="code">{{ label }}</option>
                                </select>
                            </div>
                            <div class="govuk-form-group govuk-!-margin-bottom-0">
                                <label class="govuk-label govuk-label--s">Message (optional)</label>
                                <input type="text" name="relay_message" placeholder="Optional" class="govuk-input govuk-!-width-one-third" maxlength="2000" />
                            </div>
                            <button type="submit" class="govuk-button">Approve claim</button>
                        </form>
                        <form :action="`${cityBaseUrl}/moderation/claims/${claim.id}/reject`" method="post" class="inline-flex flex-wrap gap-2 items-end">
                            <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                            <div class="govuk-form-group govuk-!-margin-bottom-0">
                                <label class="govuk-label govuk-label--s">Reason code</label>
                                <select name="reason_code" class="govuk-select govuk-!-width-auto" required>
                                    <option v-for="(label, code) in reasonCodes" :key="code" :value="code">{{ label }}</option>
                                </select>
                            </div>
                            <div class="govuk-form-group govuk-!-margin-bottom-0">
                                <label class="govuk-label govuk-label--s">Message (optional)</label>
                                <input type="text" name="relay_message" placeholder="Optional" class="govuk-input govuk-!-width-one-third" maxlength="2000" />
                            </div>
                            <button type="submit" class="govuk-button govuk-button--warning">Reject</button>
                        </form>
                    </div>
                </li>
            </ul>
            <p v-if="!(claims.data || []).length" class="mt-6 text-muted">No pending claim requests.</p>
            <nav v-if="claims.next_page_url" class="mt-4">
                <Link :href="claims.next_page_url" class="govuk-link">Next page</Link>
            </nav>
        </main>
    </CityLayout>
</template>

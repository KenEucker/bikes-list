<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import CityLayout from '@/Layouts/CityLayout.vue';
import DeleteUserForm from './Partials/DeleteUserForm.vue';
import UpdatePasswordForm from './Partials/UpdatePasswordForm.vue';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm.vue';
import { Head, Link, router, usePage } from '@inertiajs/vue3';

const props = defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
        type: String,
    },
    error: {
        type: String,
    },
    city: {
        type: Object,
        default: null,
    },
    cityBaseUrl: {
        type: String,
        default: null,
    },
    socialAccounts: {
        type: Array,
        default: () => [],
    },
    linkedProviders: {
        type: Array,
        default: () => [],
    },
    supportedSocialProviders: {
        type: Array,
        default: () => ['google', 'discord'],
    },
    canDisconnectSocial: {
        type: Boolean,
        default: false,
    },
});

const page = usePage();
const savedSearchesUrl = page.props.urls?.savedSearches || '#';
const authSocialDisconnectBase = page.props.urls?.authSocialDisconnect || '/account/settings/social';
const authGoogleRedirect = page.props.urls?.authGoogleRedirect || '';
const authDiscordRedirect = page.props.urls?.authDiscordRedirect || '';

const useCityLayout = (p) => p.city && p.cityBaseUrl;

const socialRedirectUrl = (provider) => {
    if (provider === 'google') return authGoogleRedirect;
    if (provider === 'discord') return authDiscordRedirect;
    return '#';
};

const disconnectUrl = (provider) => `${authSocialDisconnectBase}/${provider}/disconnect`;

const disconnect = (provider) => {
    router.post(disconnectUrl(provider), {}, { preserveScroll: true });
};

const isLinked = (provider) => props.linkedProviders.includes(provider);
const socialAccountFor = (provider) => props.socialAccounts.find((a) => a.provider === provider);
</script>

<template>
    <Head title="Profile" />

    <CityLayout
        v-if="useCityLayout({ city, cityBaseUrl })"
        :city="city"
        :city-base-url="cityBaseUrl"
        breadcrumb="Account settings"
    >
        <div class="py-12">
            <div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                <h1 class="govuk-heading-l">Account settings</h1>
                <gv-notification-banner v-if="error" type="error" title="Error" class="mb-4">
                    <p class="govuk-body">{{ error }}</p>
                </gv-notification-banner>
                <div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8">
                    <UpdateProfileInformationForm
                        :must-verify-email="mustVerifyEmail"
                        :status="status"
                        class="max-w-xl"
                    />
                </div>

                <div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8">
                    <h3 class="text-lg font-medium text-fg">Connected accounts</h3>
                    <p class="mt-1 text-sm text-muted">Link Google or Discord to sign in with one click.</p>
                    <div class="mt-4 space-y-4">
                        <div
                            v-for="provider in supportedSocialProviders"
                            :key="provider"
                            class="flex flex-wrap items-center gap-3 rounded border border-border p-3"
                        >
                            <span class="font-medium capitalize">{{ provider }}</span>
                            <template v-if="isLinked(provider)">
                                <span v-if="socialAccountFor(provider)?.provider_email" class="text-sm text-muted">
                                    {{ socialAccountFor(provider).provider_email }}
                                </span>
                                <img
                                    v-if="socialAccountFor(provider)?.avatar_url"
                                    :src="socialAccountFor(provider).avatar_url"
                                    :alt="provider"
                                    class="h-8 w-8 rounded-full"
                                />
                                <button
                                    v-if="canDisconnectSocial"
                                    type="button"
                                    class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
                                    @click="disconnect(provider)"
                                >
                                    Disconnect
                                </button>
                                <span v-else class="text-sm text-amber-600">
                                    Add a password or another connected account before disconnecting.
                                </span>
                            </template>
                            <a
                                v-else
                                :href="socialRedirectUrl(provider)"
                                class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
                            >
                                Connect
                            </a>
                        </div>
                    </div>
                </div>

                <div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8">
                    <UpdatePasswordForm class="max-w-xl" />
                </div>

                <div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8">
                    <h3 class="text-lg font-medium text-fg">Saved searches</h3>
                    <p class="mt-1 text-sm text-muted">View and manage your saved sale searches.</p>
                    <Link :href="savedSearchesUrl" class="mt-2 inline-block text-sm font-medium text-primary hover:opacity-90">Manage saved searches</Link>
                </div>

                <div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8">
                    <DeleteUserForm class="max-w-xl" />
                </div>
            </div>
        </div>
    </CityLayout>

    <AuthenticatedLayout v-else>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-fg">
                Profile
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                <gv-notification-banner v-if="error" type="error" title="Error" class="mb-4">
                    <p class="govuk-body">{{ error }}</p>
                </gv-notification-banner>
                <div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8">
                    <UpdateProfileInformationForm
                        :must-verify-email="mustVerifyEmail"
                        :status="status"
                        class="max-w-xl"
                    />
                </div>

                <div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8">
                    <h3 class="text-lg font-medium text-fg">Connected accounts</h3>
                    <p class="mt-1 text-sm text-muted">Link Google or Discord to sign in with one click.</p>
                    <div class="mt-4 space-y-4">
                        <div
                            v-for="provider in supportedSocialProviders"
                            :key="provider"
                            class="flex flex-wrap items-center gap-3 rounded border border-border p-3"
                        >
                            <span class="font-medium capitalize">{{ provider }}</span>
                            <template v-if="isLinked(provider)">
                                <span v-if="socialAccountFor(provider)?.provider_email" class="text-sm text-muted">
                                    {{ socialAccountFor(provider).provider_email }}
                                </span>
                                <img
                                    v-if="socialAccountFor(provider)?.avatar_url"
                                    :src="socialAccountFor(provider).avatar_url"
                                    :alt="provider"
                                    class="h-8 w-8 rounded-full"
                                />
                                <button
                                    v-if="canDisconnectSocial"
                                    type="button"
                                    class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
                                    @click="disconnect(provider)"
                                >
                                    Disconnect
                                </button>
                                <span v-else class="text-sm text-amber-600">
                                    Add a password or another connected account before disconnecting.
                                </span>
                            </template>
                            <a
                                v-else
                                :href="socialRedirectUrl(provider)"
                                class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
                            >
                                Connect
                            </a>
                        </div>
                    </div>
                </div>

                <div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8">
                    <UpdatePasswordForm class="max-w-xl" />
                </div>

                <div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8">
                    <h3 class="text-lg font-medium text-fg">Saved searches</h3>
                    <p class="mt-1 text-sm text-muted">View and manage your saved sale searches.</p>
                    <Link :href="savedSearchesUrl" class="mt-2 inline-block text-sm font-medium text-primary hover:opacity-90">Manage saved searches</Link>
                </div>

                <div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8">
                    <DeleteUserForm class="max-w-xl" />
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import CityLayout from '@/Layouts/CityLayout.vue';
import DeleteUserForm from './Partials/DeleteUserForm.vue';
import UpdatePasswordForm from './Partials/UpdatePasswordForm.vue';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm.vue';
import { Head, Link, usePage } from '@inertiajs/vue3';

defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
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
});

const savedSearchesUrl = usePage().props.urls?.savedSearches || '#';

const useCityLayout = (props) => props.city && props.cityBaseUrl;
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
                <div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8">
                    <UpdateProfileInformationForm
                        :must-verify-email="mustVerifyEmail"
                        :status="status"
                        class="max-w-xl"
                    />
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
                <div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8">
                    <UpdateProfileInformationForm
                        :must-verify-email="mustVerifyEmail"
                        :status="status"
                        class="max-w-xl"
                    />
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

<script setup>
import { computed } from 'vue';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import ThemeToggle from '@/Components/ThemeToggle.vue';
import { Link, usePage } from '@inertiajs/vue3';

const page = usePage();
const urls = computed(() => page.props.urls || {});
const dashboardUrl = computed(() => urls.value.dashboard || (typeof window !== 'undefined' ? window.location.origin + '/dashboard' : '/dashboard'));
const isDashboard = computed(() => (page.url || '').startsWith('/dashboard'));
const accountUrl = computed(() => urls.value.accountSettings || '/account/settings');
const logoutUrl = computed(() => urls.value.logout || '/logout');
</script>

<template>
    <div>
        <div class="min-h-screen bg-page">
            <gv-header
                service-name="BikesList"
                :service-url="dashboardUrl"
                homepage-url="/"
            >
                <template #logo>
                    <div class="govuk-header__logo">
                        <Link :href="dashboardUrl" class="govuk-header__link govuk-header__link--homepage flex items-center gap-2 no-underline">
                            <ApplicationLogo logo-class="block h-9 w-auto object-contain text-fg" />
                        </Link>
                    </div>
                </template>
                <template #navigation>
                    <gv-header-navigation-item :href="dashboardUrl" :active="isDashboard" text="Dashboard" />
                    <li class="govuk-header__navigation-item">
                        <ThemeToggle />
                    </li>
                    <gv-header-navigation-item :href="accountUrl" text="Account" />
                    <li class="govuk-header__navigation-item">
                        <Link
                            :href="logoutUrl"
                            method="post"
                            as="button"
                            class="govuk-header__link border-0 bg-transparent font-inherit text-inherit cursor-pointer py-2"
                        >
                            Sign out
                        </Link>
                    </li>
                </template>
            </gv-header>

            <header
                v-if="$slots.header"
                class="bg-card border-b border-border shadow-sm"
            >
                <div class="govuk-width-container govuk-!-padding-top-6 govuk-!-padding-bottom-6">
                    <slot name="header" />
                </div>
            </header>

            <main>
                <slot />
            </main>
        </div>
    </div>
</template>

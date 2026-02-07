<script setup>
import { computed } from 'vue';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
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
                    <li class="govuk-header__navigation-item">
                        <div class="relative">
                            <Dropdown align="right" width="48" content-classes="account-dropdown-menu py-1 bg-card border border-border rounded-token-md min-w-[10rem]">
                                <template #trigger>
                                    <span class="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            class="govuk-header__link inline-flex items-center gap-1 border-0 bg-transparent font-inherit text-inherit cursor-pointer underline py-2 pr-0 pl-0"
                                            aria-expanded="false"
                                            aria-haspopup="true"
                                        >
                                            Account
                                            <svg
                                                class="-me-0.5 ms-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clip-rule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </template>
                                <template #content>
                                    <DropdownLink :href="accountUrl">
                                        Profile
                                    </DropdownLink>
                                    <DropdownLink :href="logoutUrl" method="post" as="button">
                                        Log Out
                                    </DropdownLink>
                                </template>
                            </Dropdown>
                        </div>
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

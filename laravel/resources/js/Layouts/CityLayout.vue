<script setup>
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ThemeToggle from '@/Components/ThemeToggle.vue';

const props = defineProps({
    city: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    breadcrumb: { type: [String, Array], default: null },
});

const page = usePage();
const logo = page.props.logo || '/bikeslist.png';
const appName = page.props.appName || 'BikesList';

const breadcrumbItems = computed(() => {
    if (props.breadcrumb == null) return [];
    return Array.isArray(props.breadcrumb) ? [...props.breadcrumb] : [props.breadcrumb];
});
</script>

<template>
    <PublicLayout>
        <template #header>
            <gv-header
                :service-name="city.name"
                :service-url="cityBaseUrl"
                homepage-url="/"
            >
                <template #logo>
                    <div class="govuk-header__logo">
                        <a :href="cityBaseUrl" class="govuk-header__link govuk-header__link--homepage flex items-center gap-2 no-underline">
                            <img :src="logo" :alt="appName" class="h-9 w-auto object-contain" />
                            <span class="govuk-header__product-name">{{ appName }}</span>
                        </a>
                    </div>
                </template>
                <template #navigation>
                    <gv-header-navigation-item :href="`${cityBaseUrl}/for-sale`" text="For Sale" />
                    <gv-header-navigation-item :href="`${cityBaseUrl}/rides`" text="Rides" />
                    <gv-header-navigation-item :href="`${cityBaseUrl}/community`" text="Community" />
                    <gv-header-navigation-item :href="`${cityBaseUrl}/search`" text="Search" />
                    <gv-header-navigation-item
                        v-if="page.props.auth?.user"
                        :href="`${cityBaseUrl}/for-sale/new`"
                        text="Add new sale"
                    />
                    <li class="govuk-header__navigation-item">
                        <ThemeToggle />
                    </li>
                    <slot name="nav-right">
                        <gv-header-navigation-item
                            v-if="page.props.auth?.user"
                            :href="`${cityBaseUrl}/dashboard`"
                            text="Dashboard"
                        />
                        <gv-header-navigation-item
                            v-else
                            :href="page.props.urls?.signIn || '/account/sign-in'"
                            text="Sign in"
                        />
                    </slot>
                </template>
            </gv-header>
            <div v-if="breadcrumbItems.length" class="app-breadcrumbs govuk-width-container govuk-!-padding-top-3 govuk-!-padding-bottom-2">
                <gv-breadcrumbs>
                    <gv-breadcrumb-item :href="cityBaseUrl">{{ city.name }}</gv-breadcrumb-item>
                    <gv-breadcrumb-item
                        v-for="(label, i) in breadcrumbItems"
                        :key="i"
                    >
                        {{ label }}
                    </gv-breadcrumb-item>
                </gv-breadcrumbs>
            </div>
        </template>

        <slot />
    </PublicLayout>
</template>

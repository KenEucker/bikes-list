<script setup>
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ThemeToggle from '@/Components/ThemeToggle.vue';
import { Link } from '@inertiajs/vue3';

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

function breadcrumbHref(item) {
    return typeof item === 'object' && item != null && item.href != null ? item.href : undefined;
}
function breadcrumbLabel(item) {
    return typeof item === 'object' && item != null ? item.label : item;
}
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
                        <a :href="cityBaseUrl" class="flex items-center gap-2 no-underline govuk-header__link govuk-header__link--homepage">
                            <img :src="logo" :alt="appName" class="object-contain w-auto h-9" />
                            <span class="govuk-header__product-name">{{ appName }}</span>
                        </a>
                    </div>
                </template>
                <template #navigation>
                    <gv-header-navigation-item :href="`${cityBaseUrl}/rides`" text="Rides" />
                    <gv-header-navigation-item :href="`${cityBaseUrl}/for-sale`" text="For Sale" />
                    <gv-header-navigation-item :href="`${cityBaseUrl}/community`" text="Community" />
                    <gv-header-navigation-item :href="`${cityBaseUrl}/search`" text="Search" />
                    <li class="govuk-header__navigation-item">
                        <ThemeToggle />
                    </li>
                    <template v-if="page.props.auth?.user">
                        <gv-header-navigation-item :href="`${cityBaseUrl}/dashboard`" text="Dashboard" />
                        <gv-header-navigation-item
                            v-if="page.props.canAccessModeration && page.props.moderationUrl"
                            :href="page.props.moderationUrl"
                            text="Moderation"
                        />
                        <gv-header-navigation-item :href="page.props.urls?.accountSettings || '/account/settings'" text="Account" />
                        <li class="govuk-header__navigation-item">
                            <Link
                                :href="page.props.urls?.logout || '/logout'"
                                method="post"
                                as="button"
                                class="govuk-header__link border-0 bg-transparent font-inherit text-inherit cursor-pointer py-2"
                            >
                                Sign out
                            </Link>
                        </li>
                    </template>
                    <slot name="nav-right" />
                    <gv-header-navigation-item
                        v-if="!page.props.auth?.user"
                        :href="page.props.urls?.signIn || '/account/sign-in'"
                        text="Sign in"
                    />
                </template>
            </gv-header>
            <div v-if="breadcrumbItems.length" class="app-breadcrumbs govuk-width-container govuk-!-padding-top-3 govuk-!-padding-bottom-2">
                <gv-breadcrumbs>
                    <gv-breadcrumb-item :href="cityBaseUrl">{{ city.name }}</gv-breadcrumb-item>
                    <gv-breadcrumb-item
                        v-for="(item, i) in breadcrumbItems"
                        :key="i"
                        :href="breadcrumbHref(item)"
                    >
                        {{ breadcrumbLabel(item) }}
                    </gv-breadcrumb-item>
                </gv-breadcrumbs>
            </div>
        </template>

        <slot />
    </PublicLayout>
</template>

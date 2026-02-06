<script setup>
import 'leaflet/dist/leaflet.css';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { ref, onMounted, computed } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ThemeToggle from '@/Components/ThemeToggle.vue';

const props = defineProps({
    cities: { type: Array, default: () => [] },
    grouped: { type: Array, default: () => [] },
});

const page = usePage();
const urls = computed(() => page.props.urls || {});
const mapRef = ref(null);
const searchQuery = ref('');

function cityUrl(slug) {
    if (typeof window === 'undefined') return '#';
    const host = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    return `${window.location.protocol}//${slug}.${host}${port}`;
}

const filteredGrouped = computed(() => {
    const grouped = Array.isArray(props.grouped) ? props.grouped : [];
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return grouped;
    return grouped.map(grp => ({
        ...grp,
        cities: (grp.cities || []).filter(c => (c.name && c.name.toLowerCase().includes(q)) || (c.slug && c.slug.toLowerCase().includes(q))),
    })).filter(grp => (grp.cities && grp.cities.length) > 0);
});

onMounted(async () => {
    if (typeof window === 'undefined' || !mapRef.value) return;
    const cities = Array.isArray(props.cities) ? props.cities : [];
    const withCoords = cities.filter(c => {
        if (!c || c.slug == null) return false;
        const lat = c.latitude != null ? Number(c.latitude) : NaN;
        const lng = c.longitude != null ? Number(c.longitude) : NaN;
        return !Number.isNaN(lat) && !Number.isNaN(lng);
    });
    const L = (await import('leaflet')).default;
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
    const map = L.map(mapRef.value).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    withCoords.forEach(city => {
        const lat = Number(city.latitude);
        const lng = Number(city.longitude);
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`<a href="${cityUrl(city.slug)}">${city.name || city.slug}</a>`);
    });
});
</script>

<template>
    <Head title="BikesList – Cities">
        <meta name="description" content="Choose a city to view local bike listings, events, and community pages.">
        <meta property="og:title" content="BikesList – Cities">
        <meta property="og:description" content="Choose a city to view local bike listings, events, and community pages.">
        <meta property="og:url" :content="page.props.seo?.currentUrl || page.props.urls?.home || '/'">
        <link rel="canonical" :href="page.props.seo?.currentUrl || page.props.urls?.home || '/'">
    </Head>
    <PublicLayout>
        <template #nav>
            <li class="govuk-header__navigation-item">
                <ThemeToggle />
            </li>
            <gv-header-navigation-item :href="urls.terms || '/terms'" text="Terms" />
            <gv-header-navigation-item :href="urls.privacy || '/privacy'" text="Privacy" />
            <gv-header-navigation-item v-if="$page.props.auth?.user" :href="urls.accountSettings || '/account/settings'" text="Account" />
            <template v-else>
                <gv-header-navigation-item :href="urls.signIn || '/account/sign-in'" text="Sign in" />
                <gv-header-navigation-item :href="urls.signUp || '/account/sign-up'" text="Sign up" />
            </template>
        </template>

        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-xl">BikesList</h1>
            <p class="mt-2 text-muted">Choose a city to view listings, events, and community pages.</p>

            <div class="mt-8 max-w-md">
                <gv-input
                    id="city-search"
                    v-model="searchQuery"
                    label="Search cities"
                    type="text"
                    placeholder="Type to filter..."
                    class="govuk-!-width-full"
                />
            </div>

            <div class="mt-8 space-y-8">
                <template v-for="(group, gIndex) in filteredGrouped" :key="gIndex">
                    <section v-if="(group.cities && group.cities.length)" class="space-y-2">
                        <h2 class="text-lg font-semibold text-fg">
                            {{ group.country }}{{ group.state_province ? ` → ${group.state_province}` : '' }}
                        </h2>
                        <ul class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            <li v-for="city in group.cities" :key="city.id">
                                <a
                                    :href="cityUrl(city.slug)"
                                    class="block rounded-token-md border border-border bg-card px-4 py-2 shadow-sm transition hover:border-primary hover:shadow underline"
                                >
                                    <span class="font-medium text-fg">{{ city.name }}</span>
                                    <p v-if="city.description" class="mt-0.5 text-sm text-muted line-clamp-1">{{ city.description }}</p>
                                </a>
                            </li>
                        </ul>
                    </section>
                </template>
            </div>

            <div class="mt-10 h-[400px] w-full overflow-hidden rounded-token-md border border-border bg-card">
                <div ref="mapRef" class="h-full w-full" />
            </div>
        </div>
    </PublicLayout>
</template>

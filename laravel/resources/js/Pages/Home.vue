<script setup>
import 'leaflet/dist/leaflet.css';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
    cities: { type: Array, default: () => [] },
    grouped: { type: Array, default: () => [] },
});

const page = usePage();
const logo = page.props.logo || '/bikeslist.png';
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
    <Head title="BikesList – Cities" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between items-center">
                    <div class="flex items-center gap-2">
                        <Link :href="urls.home || '/'" class="flex items-center gap-2">
                            <img :src="logo" alt="BikesList" class="h-8 w-auto object-contain" />
                            <span class="text-xl font-semibold text-gray-800 dark:text-white">BikesList</span>
                        </Link>
                    </div>
                    <div class="flex items-center gap-4">
                        <Link :href="urls.terms || '/terms'" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Terms</Link>
                        <Link :href="urls.privacy || '/privacy'" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Privacy</Link>
                        <Link v-if="$page.props.auth.user" :href="urls.accountSettings || '/account/settings'" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Account</Link>
                        <template v-else>
                            <Link :href="urls.signIn || '/account/sign-in'" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Sign in</Link>
                            <Link :href="urls.signUp || '/account/sign-up'" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Sign up</Link>
                        </template>
                    </div>
                </div>
            </div>
        </nav>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">BikesList</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Choose a city to view listings, events, and community pages.</p>

            <div class="mt-6 h-[400px] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <div ref="mapRef" class="h-full w-full" />
            </div>

            <div class="mt-8">
                <label for="city-search" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Search cities</label>
                <input
                    id="city-search"
                    v-model="searchQuery"
                    type="text"
                    placeholder="Type to filter..."
                    class="mt-1 block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div class="mt-8 space-y-8">
                <template v-for="(group, gIndex) in filteredGrouped" :key="gIndex">
                    <section v-if="(group.cities && group.cities.length)" class="space-y-2">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                            {{ group.country }}{{ group.state_province ? ` → ${group.state_province}` : '' }}
                        </h2>
                        <ul class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            <li v-for="city in group.cities" :key="city.id">
                                <a
                                    :href="cityUrl(city.slug)"
                                    class="block rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm transition hover:border-indigo-300 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-600"
                                >
                                    <span class="font-medium text-gray-900 dark:text-white">{{ city.name }}</span>
                                    <p v-if="city.description" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{{ city.description }}</p>
                                </a>
                            </li>
                        </ul>
                    </section>
                </template>
            </div>
        </main>
    </div>
</template>

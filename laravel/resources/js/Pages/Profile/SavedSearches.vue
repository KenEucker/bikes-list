<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { ref, computed } from 'vue';

const props = defineProps({
    savedSearches: {
        type: Array,
        required: true,
    },
    prefill: {
        type: Object,
        default: null,
    },
});

const page = usePage();
const urls = computed(() => page.props.urls || {});
const savedSearchesBaseUrl = () => urls.value.savedSearches || '/account/saved-searches';

const showForm = ref(!!props.prefill);
const form = ref({
    city_id: props.prefill?.city_id ?? '',
    name: props.prefill?.name ?? '',
    query: props.prefill?.query ?? { q: '', type: '', min_price: '', max_price: '' },
});

function searchUrl(search) {
    const base = `${window.location.protocol}//${search.city.slug}.${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
    const params = new URLSearchParams(search.query || {}).toString();
    return `${base}/for-sale${params ? '?' + params : ''}`;
}
</script>

<template>
    <Head title="Saved searches" />
    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-fg">Saved searches</h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <p class="mb-4 text-sm text-muted">Searches you save from a city For Sale page appear here. No alerts in v1.</p>

                <div v-if="showForm || prefill" class="mb-6 rounded-lg border border-border bg-card p-4">
                    <h3 class="font-medium text-fg">Add saved search</h3>
                    <form :action="savedSearchesBaseUrl()" method="post" class="mt-3 space-y-2">
                        <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                        <input type="hidden" name="city_id" :value="form.city_id" />
                        <input type="hidden" name="query[q]" :value="form.query.q" />
                        <input type="hidden" name="query[type]" :value="form.query.type" />
                        <input type="hidden" name="query[min_price]" :value="form.query.min_price" />
                        <input type="hidden" name="query[max_price]" :value="form.query.max_price" />
                        <div>
                            <label class="block text-sm font-medium text-fg">Name</label>
                            <input v-model="form.name" type="text" name="name" required class="mt-1 block w-full rounded-md border-border bg-input text-fg shadow-sm" />
                        </div>
                        <button type="submit" class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90">Save</button>
                        <button v-if="prefill" type="button" class="ml-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-fg hover:opacity-90" @click="showForm = false; form = { city_id: '', name: '', query: {} }">Cancel</button>
                    </form>
                </div>

                <ul class="space-y-3">
                    <li
                        v-for="search in savedSearches"
                        :key="search.id"
                        class="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                    >
                        <div>
                            <a :href="searchUrl(search)" class="font-medium text-primary hover:opacity-90">{{ search.name }}</a>
                            <p class="text-sm text-muted">{{ search.city?.name }}</p>
                        </div>
                        <div class="flex gap-2">
                            <Link :href="savedSearchesBaseUrl() + '/' + search.id" method="delete" as="button" class="text-sm text-danger hover:opacity-90">Delete</Link>
                        </div>
                    </li>
                </ul>
                <p v-if="savedSearches.length === 0" class="text-muted">No saved searches. Save a search from a city For Sale page.</p>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

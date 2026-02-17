<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-8">Bikeslist</h1>
            <p class="text-xl text-gray-600 mb-8">Find bicycles in your region</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a
                    v-for="region in regions"
                    :key="region.id"
                    :href="`http://${region.slug}.bikeslist.org`"
                    class="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
                >
                    <h2 class="text-xl font-semibold text-gray-900">{{ region.name }}</h2>
                    <p class="text-gray-600 mt-2">{{ region.slug }}.bikeslist.org</p>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    regions: Array,
});
</script>

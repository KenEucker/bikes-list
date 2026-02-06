<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ region.name }}</h1>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    v-for="sale in sales.data"
                    :key="sale.id"
                    class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                    <a :href="`/for-sale/${sale.id}`">
                        <div v-if="sale.images && sale.images.length > 0" class="aspect-w-16 aspect-h-9 bg-gray-200">
                            <img :src="sale.images[0].cdn_url" :alt="sale.title" class="w-full h-48 object-cover">
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold text-gray-900">{{ sale.title }}</h3>
                            <p class="text-xl font-bold text-gray-900 mt-2">${{ (sale.price_cents / 100).toFixed(2) }}</p>
                        </div>
                    </a>
                </div>
            </div>

            <div v-if="sales.links" class="mt-8 flex justify-center">
                <a
                    v-for="link in sales.links"
                    :key="link.label"
                    :href="link.url"
                    :class="[
                        'px-4 py-2 mx-1 rounded',
                        link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                    ]"
                    v-html="link.label"
                ></a>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    region: Object,
    sales: Object,
});
</script>

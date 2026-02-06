<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div v-if="sale.images && sale.images.length > 0" class="aspect-w-16 aspect-h-9">
                    <img :src="sale.images[0].cdn_url" :alt="sale.title" class="w-full h-96 object-cover">
                </div>
                <div class="p-6">
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ sale.title }}</h1>
                    <p class="text-4xl font-bold text-gray-900 mb-6">${{ (sale.price_cents / 100).toFixed(2) }}</p>
                    <div class="prose max-w-none mb-6">
                        <p class="text-gray-700 whitespace-pre-line">{{ sale.description }}</p>
                    </div>
                    <div class="border-t pt-4">
                        <p class="text-sm text-gray-500">Listed by: {{ sale.user?.display_name || sale.user?.email }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    sale: Object,
});
</script>

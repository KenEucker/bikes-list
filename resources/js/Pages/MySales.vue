<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">My For Sale</h1>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    v-for="sale in sales.data"
                    :key="sale.id"
                    class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                    <a :href="`/for-sale/${sale.id}`">
                        <div class="p-4">
                            <h3 class="text-lg font-semibold text-gray-900">{{ sale.title }}</h3>
                            <p class="text-xl font-bold text-gray-900 mt-2">${{ (sale.price_cents / 100).toFixed(2) }}</p>
                            <p class="text-sm text-gray-500 mt-2">Status: {{ sale.status }}</p>
                        </div>
                    </a>
                </div>
            </div>

            <div v-if="sales.data.length === 0" class="text-center py-12">
                <p class="text-gray-500">You haven't created any for-sale items yet.</p>
                <a href="/for-sale/create" class="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Create Your First For Sale
                </a>
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

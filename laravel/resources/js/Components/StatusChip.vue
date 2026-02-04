<script setup>
const props = defineProps({
    status: { type: String, required: true },
});

const labels = {
    draft: 'Draft',
    pending_review: 'Pending review',
    pending: 'Pending',
    published: 'Published',
    sold: 'Sold',
    expired: 'Expired',
    removed: 'Removed',
    approved: 'Approved',
};

const classes = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    pending_review: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    sold: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    expired: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    removed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

const label = labels[props.status] ?? props.status;
const chipClass = classes[props.status] ?? classes.draft;
</script>

<template>
    <span
        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
        :class="chipClass"
    >
        {{ label }}
    </span>
</template>

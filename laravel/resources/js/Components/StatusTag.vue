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

const colourMap = {
    draft: 'grey',
    pending_review: 'yellow',
    pending: 'yellow',
    published: 'green',
    sold: 'blue',
    expired: 'grey',
    removed: 'red',
    approved: 'green',
};

const label = labels[props.status] ?? props.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const colour = colourMap[props.status] ?? 'grey';
</script>

<template>
    <gv-tag :colour="colour" v-bind="$attrs">{{ label }}</gv-tag>
</template>

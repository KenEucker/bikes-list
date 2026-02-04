<script setup>
defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
});
</script>

<template>
    <header class="govuk-!-margin-bottom-6">
        <h1 class="govuk-heading-l">{{ title }}</h1>
        <p v-if="subtitle" class="govuk-body govuk-!-margin-top-1">{{ subtitle }}</p>
        <div v-if="$slots.actions" class="govuk-!-margin-top-4">
            <slot name="actions" />
        </div>
    </header>
</template>

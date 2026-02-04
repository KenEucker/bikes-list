<script setup>
import { ref, onMounted } from 'vue';

const theme = ref('light');

function getTheme() {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.getAttribute('data-theme') || 'light';
}

function setTheme(value) {
    const next = value === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    theme.value = next;
    if (typeof document.cookie !== 'undefined') {
        document.cookie = 'bikeslist_theme=' + next + ';path=/;max-age=31536000;samesite=lax';
    }
    try {
        localStorage.setItem('bikeslist_theme', next);
    } catch (e) {}
}

function toggle() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
}

onMounted(() => {
    theme.value = getTheme();
});
</script>

<template>
    <button
        type="button"
        class="govuk-link govuk-link--no-visited-state"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggle"
    >
        {{ theme === 'dark' ? 'Light' : 'Dark' }}
    </button>
</template>

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
        class="inline-flex h-8 w-8 items-center justify-center rounded border border-border bg-transparent text-fg transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[rgb(var(--bg))]"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggle"
    >
        <span class="sr-only">{{ theme === 'dark' ? 'Light' : 'Dark' }}</span>
        <!-- Sun icon (show when dark mode, click to switch to light) -->
        <svg
            v-if="theme === 'dark'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
        </svg>
        <!-- Moon icon (show when light mode, click to switch to dark) -->
        <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
        </svg>
    </button>
</template>

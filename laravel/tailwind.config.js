import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['selector', '[data-theme="dark"]'],
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                page: 'rgb(var(--bg))',
                fg: 'rgb(var(--fg) / <alpha-value>)',
                muted: 'rgb(var(--muted) / <alpha-value>)',
                card: 'rgb(var(--card))',
                input: 'rgb(var(--input))',
                border: 'rgb(var(--border))',
                primary: 'rgb(var(--primary))',
                'primary-fg': 'rgb(var(--primary-fg))',
                danger: 'rgb(var(--danger))',
                'danger-fg': 'rgb(var(--danger-fg))',
            },
            borderRadius: {
                'token-sm': 'var(--radius-sm)',
                'token-md': 'var(--radius-md)',
            },
            ringColor: {
                focus: 'rgb(var(--focus))',
            },
        },
    },

    plugins: [forms],
};

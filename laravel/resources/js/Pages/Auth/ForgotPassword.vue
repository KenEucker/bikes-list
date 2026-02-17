<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';

defineProps({
    status: { type: String },
});

const form = useForm({
    email: '',
});

const submit = () => {
    form.post(route('password.email'));
};

const hasErrors = () => Object.keys(form.errors).length > 0;
</script>

<template>
    <GuestLayout>
        <Head title="Forgot Password" />

        <p class="govuk-body">
            Forgot your password? No problem. Just let us know your email
            address and we will email you a password reset link that will allow
            you to choose a new one.
        </p>

        <gv-notification-banner v-if="status" type="success" title="Success">
            <p class="govuk-body">{{ status }}</p>
        </gv-notification-banner>

        <form @submit.prevent="submit">
            <gv-error-summary v-if="hasErrors()" title="There is a problem">
                <gv-error-link
                    v-for="(message, field) in form.errors"
                    :key="field"
                    :target-id="field"
                    :text="message"
                />
            </gv-error-summary>

            <gv-input
                id="email"
                v-model="form.email"
                label="Email"
                type="email"
                autocomplete="username"
                :error-message="form.errors.email"
            />

            <div class="govuk-!-margin-top-6">
                <gv-button
                    type="submit"
                    variant="primary"
                    :disabled="form.processing"
                >
                    Email Password Reset Link
                </gv-button>
            </div>
        </form>
    </GuestLayout>
</template>

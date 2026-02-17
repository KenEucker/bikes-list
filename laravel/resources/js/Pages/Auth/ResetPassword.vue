<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';

const props = defineProps({
    email: { type: String, required: true },
    token: { type: String, required: true },
});

const form = useForm({
    token: props.token,
    email: props.email,
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.post(route('password.store'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};

const hasErrors = () => Object.keys(form.errors).length > 0;
</script>

<template>
    <GuestLayout>
        <Head title="Reset Password" />

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

            <gv-input
                id="password"
                v-model="form.password"
                label="Password"
                type="password"
                autocomplete="new-password"
                :error-message="form.errors.password"
            />

            <gv-input
                id="password_confirmation"
                v-model="form.password_confirmation"
                label="Confirm Password"
                type="password"
                autocomplete="new-password"
                :error-message="form.errors.password_confirmation"
            />

            <div class="govuk-!-margin-top-6">
                <gv-button
                    type="submit"
                    variant="primary"
                    :disabled="form.processing"
                >
                    Reset Password
                </gv-button>
            </div>
        </form>
    </GuestLayout>
</template>

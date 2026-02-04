<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';

const form = useForm({
    password: '',
});

const submit = () => {
    form.post(route('password.confirm'), {
        onFinish: () => form.reset(),
    });
};

const hasErrors = () => Object.keys(form.errors).length > 0;
</script>

<template>
    <GuestLayout>
        <Head title="Confirm Password" />

        <p class="govuk-body">
            This is a secure area of the application. Please confirm your
            password before continuing.
        </p>

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
                id="password"
                v-model="form.password"
                label="Password"
                type="password"
                autocomplete="current-password"
                :error-message="form.errors.password"
            />

            <div class="govuk-!-margin-top-6">
                <gv-button
                    type="submit"
                    variant="primary"
                    :disabled="form.processing"
                >
                    Confirm
                </gv-button>
            </div>
        </form>
    </GuestLayout>
</template>

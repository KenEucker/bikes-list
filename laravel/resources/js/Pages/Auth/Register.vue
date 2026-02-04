<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

const props = defineProps({
    submitUrl: { type: String, default: '' },
    signInUrl: { type: String, default: '' },
});

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const formSubmitUrl = () => props.submitUrl || (typeof window !== 'undefined' ? window.location.origin + '/register' : '/register');
const submit = () => {
    form.post(formSubmitUrl(), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};

const hasErrors = () => Object.keys(form.errors).length > 0;
</script>

<template>
    <GuestLayout>
        <Head title="Register" />

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
                id="name"
                v-model="form.name"
                label="Name"
                type="text"
                autocomplete="name"
                :error-message="form.errors.name"
            />

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

            <div class="govuk-button-group govuk-!-margin-top-6">
                <Link
                    :href="props.signInUrl || $page.props.urls?.signIn || '/account/sign-in'"
                    class="govuk-link"
                >
                    Already registered?
                </Link>
                <gv-button
                    type="submit"
                    variant="primary"
                    :disabled="form.processing"
                >
                    Sign up
                </gv-button>
            </div>
        </form>
    </GuestLayout>
</template>

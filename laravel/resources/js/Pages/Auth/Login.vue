<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

const props = defineProps({
    canResetPassword: { type: Boolean },
    status: { type: String },
    submitUrl: { type: String, default: '' },
    signUpUrl: { type: String, default: '' },
    passwordRequestUrl: { type: String, default: '' },
});

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const formSubmitUrl = () => props.submitUrl || (typeof window !== 'undefined' ? window.location.origin + '/login' : '/login');
const submit = () => {
    form.post(formSubmitUrl(), {
        onFinish: () => form.reset('password'),
    });
};

const hasErrors = () => Object.keys(form.errors).length > 0;
</script>

<template>
    <GuestLayout>
        <Head title="Log in" />

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
                class="govuk-!-width-full"
            />

            <gv-input
                id="password"
                v-model="form.password"
                label="Password"
                type="password"
                autocomplete="current-password"
                :error-message="form.errors.password"
                class="govuk-!-width-full"
            />

            <gv-checkbox
                id="remember"
                v-model="form.remember"
                name="remember"
                label="Remember me"
                class="govuk-!-margin-top-4"
            />

            <div class="govuk-button-group govuk-!-margin-top-6">
                <Link
                    :href="props.signUpUrl || $page.props.urls?.signUp || '/account/sign-up'"
                    class="govuk-link"
                >
                    Sign up
                </Link>
                <Link
                    v-if="canResetPassword"
                    :href="props.passwordRequestUrl || $page.props.urls?.passwordRequest || '/forgot-password'"
                    class="govuk-link"
                >
                    Forgot your password?
                </Link>
                <gv-button
                    type="submit"
                    variant="primary"
                    :disabled="form.processing"
                >
                    Sign in
                </gv-button>
            </div>
        </form>
    </GuestLayout>
</template>

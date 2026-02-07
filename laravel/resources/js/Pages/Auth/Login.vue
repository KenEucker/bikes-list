<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';

const props = defineProps({
    canResetPassword: { type: Boolean },
    status: { type: String },
    error: { type: String },
    submitUrl: { type: String, default: '' },
    signUpUrl: { type: String, default: '' },
    passwordRequestUrl: { type: String, default: '' },
    authGoogleRedirect: { type: String, default: '' },
    authDiscordRedirect: { type: String, default: '' },
});

const page = usePage();
const authGoogleRedirectUrl = () => props.authGoogleRedirect || page.props.urls?.authGoogleRedirect || '';
const authDiscordRedirectUrl = () => props.authDiscordRedirect || page.props.urls?.authDiscordRedirect || '';
const showSocialLogin = () => authGoogleRedirectUrl() || authDiscordRedirectUrl();

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
        <gv-notification-banner v-if="error" type="error" title="Error">
            <p class="govuk-body">{{ error }}</p>
        </gv-notification-banner>

        <div v-if="showSocialLogin()" class="govuk-!-margin-bottom-6">
            <p class="govuk-body govuk-!-margin-bottom-3">Continue with:</p>
            <div class="govuk-button-group">
                <a
                    v-if="authGoogleRedirectUrl()"
                    :href="authGoogleRedirectUrl()"
                    class="govuk-button govuk-button--secondary"
                    style="background-color: #fff; color: #1f1f1f; border: 1px solid #1f1f1f;"
                >
                    Google
                </a>
                <a
                    v-if="authDiscordRedirectUrl()"
                    :href="authDiscordRedirectUrl()"
                    class="govuk-button govuk-button--secondary"
                    style="background-color: #5865f2; color: #fff; border: 1px solid #5865f2;"
                >
                    Discord
                </a>
            </div>
            <p class="govuk-body govuk-!-margin-top-4 govuk-!-margin-bottom-0" style="color: #505a5f;">or</p>
        </div>

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

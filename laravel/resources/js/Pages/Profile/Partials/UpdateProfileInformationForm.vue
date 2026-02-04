<script setup>
import { Link, useForm, usePage } from '@inertiajs/vue3';

defineProps({
    mustVerifyEmail: { type: Boolean },
    status: { type: String },
});

const page = usePage();
const user = page.props.auth?.user;
const profileUpdateUrl = page.props.urls?.accountSettingsUpdate ?? '/account/settings';
const verificationSendUrl = page.props.urls?.verificationSend ?? '/email/verification-notification';

const form = useForm({
    name: user?.name ?? '',
    email: user?.email ?? '',
});

const hasErrors = () => Object.keys(form.errors).length > 0;
</script>

<template>
    <section>
        <header>
            <h2 class="govuk-heading-l">Profile Information</h2>
            <p class="govuk-body">
                Update your account's profile information and email address.
            </p>
        </header>

        <form @submit.prevent="form.patch(profileUpdateUrl)">
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

            <div v-if="mustVerifyEmail && user?.email_verified_at === null" class="govuk-!-margin-top-4">
                <p class="govuk-body">
                    Your email address is unverified.
                    <Link
                        :href="verificationSendUrl"
                        method="post"
                        as="button"
                        class="govuk-link"
                    >
                        Click here to re-send the verification email.
                    </Link>
                </p>
                <gv-notification-banner
                    v-if="status === 'verification-link-sent'"
                    type="success"
                    title="Success"
                >
                    <p class="govuk-body">A new verification link has been sent to your email address.</p>
                </gv-notification-banner>
            </div>

            <div class="govuk-button-group govuk-!-margin-top-6">
                <gv-button type="submit" variant="primary" :disabled="form.processing">
                    Save
                </gv-button>
                <p v-if="form.recentlySuccessful" class="govuk-body govuk-!-margin-0">
                    Saved.
                </p>
            </div>
        </form>
    </section>
</template>

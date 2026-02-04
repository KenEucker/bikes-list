<script setup>
import { useForm, usePage } from '@inertiajs/vue3';
import { ref } from 'vue';

const passwordInput = ref(null);
const currentPasswordInput = ref(null);
const passwordUpdateUrl = usePage().props.urls?.passwordUpdate ?? '/password';

const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const updatePassword = () => {
    form.put(passwordUpdateUrl, {
        preserveScroll: true,
        onSuccess: () => form.reset(),
        onError: () => {
            if (form.errors.password) {
                form.reset('password', 'password_confirmation');
                passwordInput.value?.focus();
            }
            if (form.errors.current_password) {
                form.reset('current_password');
                currentPasswordInput.value?.focus();
            }
        },
    });
};

const hasErrors = () => Object.keys(form.errors).length > 0;
</script>

<template>
    <section>
        <header>
            <h2 class="govuk-heading-l">Update Password</h2>
            <p class="govuk-body">
                Ensure your account is using a long, random password to stay secure.
            </p>
        </header>

        <form @submit.prevent="updatePassword">
            <gv-error-summary v-if="hasErrors()" title="There is a problem">
                <gv-error-link
                    v-for="(message, field) in form.errors"
                    :key="field"
                    :target-id="field"
                    :text="message"
                />
            </gv-error-summary>

            <gv-input
                id="current_password"
                ref="currentPasswordInput"
                v-model="form.current_password"
                label="Current Password"
                type="password"
                autocomplete="current-password"
                :error-message="form.errors.current_password"
            />

            <gv-input
                id="password"
                ref="passwordInput"
                v-model="form.password"
                label="New Password"
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

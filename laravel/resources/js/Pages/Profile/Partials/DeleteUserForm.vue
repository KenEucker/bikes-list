<script setup>
import Modal from '@/Components/Modal.vue';
import { useForm, usePage } from '@inertiajs/vue3';
import { nextTick, ref } from 'vue';

const confirmingUserDeletion = ref(false);
const passwordInput = ref(null);
const accountDestroyUrl = usePage().props.urls?.accountSettingsDestroy ?? '/account/settings';

const form = useForm({
    password: '',
});

const confirmUserDeletion = () => {
    confirmingUserDeletion.value = true;
    nextTick(() => passwordInput.value?.focus());
};

const deleteUser = () => {
    form.delete(accountDestroyUrl, {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value?.focus(),
        onFinish: () => form.reset(),
    });
};

const closeModal = () => {
    confirmingUserDeletion.value = false;
    form.clearErrors();
    form.reset();
};
</script>

<template>
    <section>
        <header>
            <h2 class="govuk-heading-l">Delete Account</h2>
            <p class="govuk-body">
                Once your account is deleted, all of its resources and data will
                be permanently deleted. Before deleting your account, please
                download any data or information that you wish to retain.
            </p>
        </header>

        <gv-button variant="warning" @click="confirmUserDeletion">
            Delete Account
        </gv-button>

        <Modal :show="confirmingUserDeletion" aria-labelledby="delete-account-heading" @close="closeModal">
            <div class="govuk-body">
                <h2 id="delete-account-heading" class="govuk-heading-m">
                    Are you sure you want to delete your account?
                </h2>
                <p class="govuk-body">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Please enter your password to
                    confirm you would like to permanently delete your account.
                </p>

                <gv-input
                    id="password"
                    ref="passwordInput"
                    v-model="form.password"
                    label="Password"
                    type="password"
                    autocomplete="current-password"
                    :error-message="form.errors.password"
                    class="govuk-!-width-three-quarters"
                    @keyup.enter="deleteUser"
                />

                <div class="govuk-button-group govuk-!-margin-top-6">
                    <gv-button variant="secondary" @click="closeModal">
                        Cancel
                    </gv-button>
                    <gv-button
                        variant="warning"
                        :disabled="form.processing"
                        @click="deleteUser"
                    >
                        Delete Account
                    </gv-button>
                </div>
            </div>
        </Modal>
    </section>
</template>

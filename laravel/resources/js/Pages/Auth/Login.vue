<script setup>
import Checkbox from '@/Components/Checkbox.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
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
</script>

<template>
    <GuestLayout>
        <Head title="Log in" />

        <div v-if="status" class="mb-4 text-sm font-medium text-green-600">
            {{ status }}
        </div>

        <form @submit.prevent="submit">
            <div>
                <InputLabel for="email" value="Email" />

                <TextInput
                    id="email"
                    type="email"
                    class="mt-1 block w-full"
                    v-model="form.email"
                    required
                    autofocus
                    autocomplete="username"
                />

                <InputError class="mt-2" :message="form.errors.email" />
            </div>

            <div class="mt-4">
                <InputLabel for="password" value="Password" />

                <TextInput
                    id="password"
                    type="password"
                    class="mt-1 block w-full"
                    v-model="form.password"
                    required
                    autocomplete="current-password"
                />

                <InputError class="mt-2" :message="form.errors.password" />
            </div>

            <div class="mt-4 block">
                <label class="flex items-center">
                    <Checkbox name="remember" v-model:checked="form.remember" />
                    <span class="ms-2 text-sm text-gray-600"
                        >Remember me</span
                    >
                </label>
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-between gap-2">
                <Link
                    :href="props.signUpUrl || $page.props.urls?.signUp || '/account/sign-up'"
                    class="text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    Sign up
                </Link>
                <div class="flex items-center gap-2">
                    <Link
                        v-if="canResetPassword"
                        :href="props.passwordRequestUrl || $page.props.urls?.passwordRequest || '/forgot-password'"
                        class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Forgot your password?
                    </Link>
                    <PrimaryButton
                    class="ms-4"
                    :class="{ 'opacity-25': form.processing }"
                    :disabled="form.processing"
                >
                    Sign in
                </PrimaryButton>
                </div>
            </div>
        </form>
    </GuestLayout>
</template>

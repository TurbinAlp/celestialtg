<template>
    <q-page class="reset-password-page">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat round dense icon="arrow_back" @click="goBack" />
                <q-toolbar-title>Reset Password</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <div class="content q-pa-md">
            <q-tabs v-model="resetType" dense class="text-grey" active-color="primary" indicator-color="primary"
                align="justify" narrow-indicator>
                <q-tab name="phone" label="Phone" />
                <q-tab name="email" label="Email" />
            </q-tabs>

            <q-tab-panels v-model="resetType" animated class="q-mt-md">
                <q-tab-panel name="phone" class="q-pa-none">
                    <q-input type="number" outlined v-model="phone" label="Please enter phone number" class="q-mb-md">
                        <template v-slot:prepend>
                            <q-btn flat dense class="country-code-btn"
                                @click="router.push({ name: 'country', query: { from: 'resetpassword' } })">
                                {{ countryCode }}
                                <q-icon name="arrow_drop_down" class="q-ml-xs" />
                            </q-btn>
                        </template>
                    </q-input>
                </q-tab-panel>

                <q-tab-panel name="email" class="q-pa-none">
                    <q-input outlined v-model="email" type="email" label="Please enter email" class="q-mb-md" />
                </q-tab-panel>
            </q-tab-panels>

            <q-input outlined v-model="verificationCode" label="Please enter verification code" class="q-mb-md">
                <template v-slot:append>
                    <q-btn flat label="Send" color="orange" @click="sendVerificationCode" />
                </template>
            </q-input>

            <q-input v-model="newPassword" outlined :type="isPwd ? 'password' : 'text'"
                label="Please enter new login password" class="q-mb-md">
                <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="isPwd = !isPwd" />
                </template>
            </q-input>
        </div>

        <q-footer class="bg-white q-pa-md">
            <q-btn color="primary" class="full-width" rounded label="Confirm" @click="confirmReset" />
        </q-footer>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();

const resetType = ref('phone');
const phone = ref('');
const email = ref('');
const verificationCode = ref('');
const newPassword = ref('');
const isPwd = ref(true);

const countryCode = ref('+81');

onMounted(() => {
    const queryCountryCode = router.currentRoute.value.query.countryCode;
    if (queryCountryCode) {
        countryCode.value = `${queryCountryCode}`;
    }
});

const goBack = () => {
    router.back();
};

const validateInputs = () => {
    const phoneRegex = /^[0-9]+$/; // Only numbers
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (resetType.value === 'phone') {
        if (!phone.value || !phoneRegex.test(phone.value)) {
            $q.notify({
                position: 'top-right',
                color: 'negative',
                message: 'Please enter a valid phone number containing only numbers.',
                icon: 'error'
            });
            return false;
        }
        if (!verificationCode.value) {
            $q.notify({
                position: 'top-right',
                color: 'negative',
                message: 'Verification code is required.',
                icon: 'error'
            });
            return false;
        }
        if (!newPassword.value) {
            $q.notify({
                position: 'top-right',
                color: 'negative',
                message: 'New password is required.',
                icon: 'error'
            });
            return false;
        }
    } else if (resetType.value === 'email') {
        if (!email.value || !emailRegex.test(email.value)) {
            $q.notify({
                position: 'top-right',
                color: 'negative',
                message: 'Please enter a valid email address.',
                icon: 'error'
            });
            return false;
        }
        if (!verificationCode.value) {
            $q.notify({
                position: 'top-right',
                color: 'negative',
                message: 'Verification code is required.',
                icon: 'error'
            });
            return false;
        }
        if (!newPassword.value) {
            $q.notify({
                position: 'top-right',
                color: 'negative',
                message: 'New password is required.',
                icon: 'error'
            });
            return false;
        }
    }
    return true; // Return true if all validations pass
};

const confirmReset = () => {
    if (validateInputs()) {
        // Implement password reset logic
        $q.notify({
            position: 'top-right',
            color: 'positive',
            message: 'Password reset successful!',
            icon: 'check_circle'
        });
    }
};

const sendVerificationCode = () => {
    // Implement send verification code logic
    $q.notify({
        position: 'top-right',
        color: 'positive',
        message: 'Verification code sent!',
        icon: 'check_circle'
    });
};
</script>

<style scoped>
.reset-password-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.content {
    flex-grow: 1;
    overflow-y: auto;
}

.q-footer {
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}
</style>

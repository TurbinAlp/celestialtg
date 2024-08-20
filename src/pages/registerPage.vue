<template>
    <q-page class="register-page">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat round dense icon="arrow_back" @click="goBack" />
                <q-space />
            </q-toolbar>
        </q-header>

        <div class="content q-pa-md">
            <h4 class="text-h4 q-mb-md">Register</h4>

            <q-tabs v-model="registerType" dense class="text-grey" active-color="primary" indicator-color="primary"
                align="justify" narrow-indicator>
                <q-tab name="phone" label="Phone" />
                <q-tab name="email" label="Email" />
            </q-tabs>

            <q-tab-panels v-model="registerType" animated class="q-mt-md">
                <q-tab-panel name="phone" class="q-pa-none">
                    <q-input type="number" outlined v-model="phone" class="q-mb-md" label="Phone Number">
                        <template v-slot:prepend>
                            <q-btn flat dense class="country-code-btn"
                                @click="router.push({ name: 'country', query: { from: 'register' } })">
                                {{ countryCode }}
                                <q-icon name="arrow_drop_down" class="q-ml-xs" />
                            </q-btn>
                        </template>
                    </q-input>
                </q-tab-panel>

                <q-tab-panel name="email" class="q-pa-none">
                    <q-input outlined v-model="email" type="email" class="q-mb-md" label="Email" />
                </q-tab-panel>
            </q-tab-panels>

            <q-input v-model="password" outlined :type="isPwd ? 'password' : 'text'" label="Password" class="q-mb-md">
                <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="isPwd = !isPwd" />
                </template>
            </q-input>

            <q-input v-model="confirmPassword" outlined :type="isConfirmPwd ? 'password' : 'text'"
                label="Confirm Password" class="q-mb-md">
                <template v-slot:append>
                    <q-icon :name="isConfirmPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="isConfirmPwd = !isConfirmPwd" />
                </template>
            </q-input>

            <q-input v-model="invitationCode" outlined label="Invitation Code" class="q-mb-md" />

            <q-input v-model="verificationCode" outlined label="Verification Code" class="q-mb-md">
                <template v-slot:append>
                    <q-btn flat label="Send" color="primary" @click="sendVerificationCode" />
                </template>
            </q-input>

            <div class="text-center q-mt-md">
                Already have an account? <router-link class="text-primary" to="/login">Login</router-link>
            </div>
        </div>

        <q-footer class="bg-white q-pa-md">
            <q-btn color="primary" class="full-width" label="Register" @click="register" />
        </q-footer>
    </q-page>
    <q-dialog v-model="loading" persistent>
        <q-card>
            <q-card-section class="row items-center q-pa-md">
                <q-spinner color="primary" />
                <span class="q-ml-sm">Registering...</span>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
const $q = useQuasar();
const router = useRouter();

const registerType = ref('phone');
const phone = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const invitationCode = ref('');
const verificationCode = ref('');
const isPwd = ref(true);
const isConfirmPwd = ref(true);
const countryCode = ref('+81');
const loading = ref(false);

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
    const phoneRegex = /^[0-9\-\+\s]{10,}$/; // Basic phone validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation

    if (registerType.value === 'phone') {
        if (!phone.value || !phoneRegex.test(phone.value)) {
            return 'Please enter a valid phone number.';
        }
        if (!password.value) {
            return 'Password is required.';
        }
        if (password.value !== confirmPassword.value) {
            return 'Passwords do not match.';
        }
    } else if (registerType.value === 'email') {
        if (!email.value || !emailRegex.test(email.value)) {
            return 'Please enter a valid email address.';
        }
        if (!password.value) {
            return 'Password is required.';
        }
        if (password.value !== confirmPassword.value) {
            return 'Passwords do not match.';
        }
    }
    return ''; // Return an empty string if all validations pass
};

// registration 
const register = async () => {
    let formattedPhone = null;

    if (registerType.value === 'phone' && phone.value) {
        formattedPhone = phone.value;
    }

    loading.value = true;  // Show loading spinner

    const registerData = {
        phone: formattedPhone || null,
        countryCode: countryCode.value || null,
        email: email.value || null,
        password: password.value,
        confirmPassword: confirmPassword.value,
        invitationCode: invitationCode.value
    };

    try {
        const response = await fetch('http://localhost:2000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        const result = await response.json();

        if (response.ok) {
            $q.notify({ type: 'positive', message: 'Registration successful!' });
            router.push('/');
        } else {
            $q.notify({ type: 'negative', message: result.message });
        }
    } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: 'An error occurred during registration.' });
    } finally {
        loading.value = false;
    }
};



const sendVerificationCode = () => {
    // Implement send verification code logic
};
</script>

<style scoped>
.register-page {
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

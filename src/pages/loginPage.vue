<template>
    <q-page class="login-page q-pa-md">
        <q-header class="bg-white text-black">
            <!-- <q-toolbar>
                <q-btn flat round dense icon="arrow_back" @click="goBack" />
                <q-space />
            </q-toolbar> -->
        </q-header>

        <div class="q-mt-xl">
            <h4 class="text-h4 q-mb-md">Login</h4>

            <q-tabs v-model="loginType" dense class="text-grey" active-color="primary" indicator-color="primary"
                align="justify" narrow-indicator>
                <q-tab name="phone" label="Phone" />
                <q-tab name="email" label="Email" />
            </q-tabs>

            <q-tab-panels v-model="loginType" animated>
                <q-tab-panel name="phone" class="q-pa-none">
                    <q-input type="number" outlined v-model="phone" class="q-mb-md full-width" label="Phone Number" />
                </q-tab-panel>

                <q-tab-panel name="email" class="q-pa-none">
                    <q-input outlined v-model="email" type="email" class="q-mb-md full-width" label="Email" />
                </q-tab-panel>
            </q-tab-panels>

            <q-input v-model="password" outlined :type="isPwd ? 'password' : 'text'" class="q-mb-md full-width"
                label="Password">
                <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="isPwd = !isPwd" />
                </template>
            </q-input>

            <div class="row items-center justify-between q-mb-md">
                <q-checkbox v-model="rememberMe" label="Remember me" />
                <q-btn flat color="primary" label="Forgot Password?" :to="'/resetpassword'" />
            </div>

            <q-btn color="primary" class="full-width" label="Login" @click="login" />

            <div class="text-center q-mt-sm">
                No account? <router-link class="text-primary" to="/register">Register</router-link>
            </div>

            <div class="text-center text-grey q-mt-xl">
                v 1.0.0
            </div>
        </div>
        <q-dialog v-model="loading" persistent>
            <q-card>
                <q-card-section class="row items-center q-pa-md">
                    <q-spinner color="primary" />
                    <span class="q-ml-sm">Logging in...</span>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const loginType = ref('phone');
const phone = ref('');
const email = ref('');
const password = ref('');
const isPwd = ref(true);
const rememberMe = ref(false);
const countryCode = ref('+81');
const loading = ref(false);

onMounted(() => {
    const queryCountryCode = router.currentRoute.value.query.countryCode;
    if (queryCountryCode) {
        countryCode.value = `${queryCountryCode}`;
    }
});

const validateInputs = () => {
    const phoneRegex = /^[0-9\-\+\s]{10,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (loginType.value === 'phone') {
        if (!phone.value) {
            $q.notify({
                position: 'top-right',
                color: 'negative',
                message: 'Phone number is required.',
                icon: 'error'
            });
            return false;
        }
        if (!phoneRegex.test(phone.value)) {
            $q.notify({
                position: 'top-right',
                color: 'negative',
                message: 'Phone number must contain only numbers and be at least 10 characters long.',
                icon: 'error'
            });
            return false;
        }
        if (!password.value) {
            $q.notify({
                position: 'top-right',
                color: 'negative',
                message: 'Password is required.',
                icon: 'error'
            });
            return false;
        }
    } else if (loginType.value === 'email') {
        if (!email.value) {
            $q.notify({
                position: 'top-right',
                color: 'negative',
                message: 'Email is required.',
                icon: 'error'
            });
            return false;
        }
        if (!emailRegex.test(email.value)) {
            $q.notify({
                position: 'top-right',
                color: 'negative',
                message: 'Please enter a valid email address.',
                icon: 'error'
            });
            return false;
        }
        if (!password.value) {
            $q.notify({
                position: 'top-right',
                color: 'negative',
                message: 'Password is required.',
                icon: 'error'
            });
            return false;
        }
    }
    return true; // All validations passed
};

const login = async () => {
    if (validateInputs()) {
        let formattedPhone = null;

        if (loginType.value === 'phone' && phone.value) {
            formattedPhone = phone.value;
        }

        loading.value = true;

        try {
            const response = await fetch('http://localhost:2000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    loginType: loginType.value,
                    phone: formattedPhone || null,
                    email: email.value || null,
                    password: password.value,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                authStore.setUser(data.user, data.token, rememberMe.value);

                if (rememberMe.value) {
                    localStorage.setItem('authToken', data.token);
                } else {
                    sessionStorage.setItem('authToken', data.token);
                }

                $q.notify({
                    position: 'top-right',
                    color: 'positive',
                    message: 'Login successful!',
                    icon: 'check_circle'
                });
                router.push({ name: 'dashboard' })
            } else {
                $q.notify({
                    position: 'top-right',
                    color: 'negative',
                    message: data.error,
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error(error)
            $q.notify({
                position: 'top-right',
                color: 'negative',
                message: 'Server error. Please try again later.',
                icon: 'error'
            });
        } finally {
            loading.value = false;
        }
    }
};



const forgotPassword = () => {
    // Implement forgot password logic
};

const register = () => {
    router.push({ name: 'register' })
};
</script>

<style scoped>
.login-page {
    max-width: 400px;
    margin: 0 auto;
}

.full-width {
    width: 100%;
}

.country-code-btn {
    min-width: 80px;
    justify-content: flex-start;
}

.q-tab-panel {
    padding: 0;
}
</style>

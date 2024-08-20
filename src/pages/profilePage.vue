<template>
    <q-page class="q-pa-md column justify-between bg-grey-10 text-white">
        <div>
            <div class="row items-center q-mb-md">
                <q-avatar size="40px" color="primary" text-color="white" @click="goToAccount">
                    <img :src="profilePicture" alt="Profile Picture" />
                </q-avatar>
                <div class="q-ml-md">
                    <div class="text-weight-bold">{{ userName || 'N/A' }}</div>
                    <div class="text-caption">
                        ID {{ authStore.user.id || 'N/A' }}
                        <q-icon
                            name="content_copy"
                            size="xs"
                            @click="copyInvitationCode"
                        />
                        <q-tooltip>
                            Copy ID
                        </q-tooltip>
                    </div>
                </div>
                <q-space />
                <!-- <q-chip color="orange" text-color="white">
                    VIP1
                </q-chip> -->
            </div>

            <q-card dark class="bg-grey-9 q-mb-md">
                <q-card-section>
                    <div class="row items-center justify-between">
                        <div>
                            <div class="text-caption">Wallet (USDT)</div>
                            <div class="text-h6">{{ wallet || '0.00' }}</div>
                        </div>
                        <q-btn round flat color="grey" icon="info" size="sm" :to="{ name: 'records' }" />
                    </div>
                    <div class="row q-mt-md">
                        <q-btn color="primary" class="col q-mr-sm" label="Deposit" :to="'/deposit'" />
                        <q-btn color="red" class="col q-mr-sm" label="Withdraw" :to="{ name: 'withdraw' }" />
                        <q-btn color="grey" outline class="col" label="Transfer" :to="{ name: 'balancetransfer' }" />
                    </div>
                </q-card-section>
            </q-card>

            <q-card class="bg-purple text-white q-mb-md">
                <q-card-section class="row items-center">
                    <div class="col">
                        <div>Invite Friends</div>
                        <div class="text-caption">Invite friends to get rich rewards!</div>
                    </div>
                    <q-btn round color="white" text-color="purple" label="Go" :to="'/refferal'" />
                </q-card-section>
            </q-card>

            <q-list bordered separator>
                <q-item clickable v-ripple :to="{ name: 'records' }">
                    <q-item-section avatar>
                        <q-icon name="receipt" color="primary" />
                    </q-item-section>
                    <q-item-section>Fund Records</q-item-section>
                    <q-item-section side>
                        <q-icon name="chevron_right" />
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple>
                    <q-item-section avatar>
                        <q-icon name="security" color="primary" />
                    </q-item-section>
                    <q-item-section>Account Security</q-item-section>
                    <q-item-section side>
                        <q-icon name="chevron_right" />
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple>
                    <q-item-section avatar>
                        <q-icon name="support_agent" color="primary" />
                    </q-item-section>
                    <q-item-section>Online Support</q-item-section>
                    <q-item-section side>
                        <q-icon name="chevron_right" />
                    </q-item-section>
                </q-item>
            </q-list>
        </div>

        <div bordered class="q-pa-md bg-blue-grey-9 q-border-xl">
            <q-btn flat color="white" label="Log out" class="full-width" round @click="logout" />
        </div>
    </q-page>
    <FooterComponent />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import FooterComponent from '../components/footerComponent.vue'

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();
const wallet = ref('');
const userName = ref('');
const profilePicture = ref(''); 

const fetchUserData = async () => {
    try {
        const response = await fetch(`http://localhost:2000/user/${authStore.user.id}`);
        const result = await response.json();
        wallet.value = result.data.wallet;
        userName.value = result.data.userName;
        profilePicture.value = result.data.profile_picture; 

        if (result.success) {
            // Update the Pinia store with the fetched data
            // authStore.setUser(result.data, authStore.token, false);
        } else {
            $q.notify({
                message: 'Failed to fetch user data',
                color: 'negative',
                position: 'top-right',
                timeout: 1500
            });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        $q.notify({
            message: 'Error fetching user data',
            color: 'negative',
            position: 'top-right',
            timeout: 1500
        });
    }
};

onMounted(() => {
    fetchUserData();
});

const logout = () => {
    authStore.clearUser();
    router.push('/');
};

const copyInvitationCode = () => {
    if (authStore.user.id) {
        navigator.clipboard.writeText(authStore.user.id).then(() => {
            $q.notify({
                message: 'ID copied to clipboard',
                color: 'positive',
                position: 'top-right',
                timeout: 1500
            });
        }).catch(() => {
            $q.notify({
                message: 'Failed to copy ID',
                color: 'negative',
                position: 'top-right',
                timeout: 1500
            });
        });
    }
};

const goToAccount = () => {
    router.push('/account');
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>

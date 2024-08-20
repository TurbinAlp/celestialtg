<template>
    <q-page class="fund-transfer-page">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat round dense icon="arrow_back" @click="goBack" />
                <q-toolbar-title>Fund Transfer</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <div class="q-pa-md">
            <div class="account-selection">
                <q-item clickable v-ripple>
                    <q-item-section>
                        <q-item-label class="text-green">From</q-item-label>
                        <q-item-label>{{ fromAccount }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="chevron_right" />
                    </q-item-section>
                </q-item>

                <q-btn round flat color="grey-7" icon="swap_vert" class="switch-button" @click="switchAccounts" />

                <q-item clickable v-ripple>
                    <q-item-section>
                        <q-item-label class="text-green">To</q-item-label>
                        <q-item-label>{{ toAccount }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="chevron_right" />
                    </q-item-section>
                </q-item>
            </div>

            <q-item clickable v-ripple @click="showCurrencyOptions = true" class="q-mt-md">
                <q-item-section>
                    <q-item-label>Currency</q-item-label>
                    <q-item-label caption>
                        <q-avatar size="20px" class="q-mr-xs">
                            <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT">
                        </q-avatar>
                        USDT
                    </q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-icon name="expand_more" />
                </q-item-section>
            </q-item>

            <div class="q-mt-md">
                <div class="text-subtitle2">Transfer amount</div>
                <q-input v-model.number="transferAmount" placeholder="Please enter transfer amount" filled class="q-mt-sm" type="number">
                    <template v-slot:append>
                        <q-btn flat color="primary" label="All" @click="setMaxAmount" />
                    </template>
                </q-input>
            </div>

            <div class="text-caption q-mt-sm">
                Transferable: {{ transferable }} USDT
            </div>
        </div>

        <q-footer elevated class="bg-white">
            <q-btn label="Confirm" color="primary" class="full-width q-ma-sm" :disable="!isValidAmount" @click="confirmTransfer" />
        </q-footer>

        <q-dialog v-model="showCurrencyOptions">
            <q-card style="min-width: 300px">
                <q-card-section>
                    <div class="text-h6">Select Currency</div>
                </q-card-section>
                <q-card-section>
                    <q-item clickable v-close-popup>
                        <q-item-section avatar>
                            <q-avatar size="28px">
                                <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT">
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>USDT</q-item-section>
                    </q-item>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../store/auth';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const fromAccount = ref('Commissions'); 
const toAccount = ref('Wallet'); 
const transferAmount = ref(0);
const showCurrencyOptions = ref(false);

const commissionsBalance = ref(0);
const walletBalance = ref(0);

const transferable = computed(() => {
    return commissionsBalance.value;
});

const isValidAmount = computed(() => {
    const amount = parseFloat(transferAmount.value);
    return amount > 0 && amount <= transferable.value;
});

const goBack = () => {
    router.back();
};

const setMaxAmount = () => {
    transferAmount.value = transferable.value;
};

const switchAccounts = () => {
    // Switching accounts is irrelevant here as we only have one valid option for each
};

// Function to fetch total commissions
const fetchTotalCommissions = async () => {
    try {
        const userId = authStore.user.id;
        console.log('HIII NDIO INAPITA APA: ', userId)
        const response = await fetch(`http://localhost:2000/get-commissions/${userId}`);
        const result = await response.json();
        if (result.success) {
            commissionsBalance.value = result.totalCommissions;
        } else {
            $q.notify({
                color: 'negative',
                message: 'Failed to fetch commissions.',
                position: 'top-right',
                timeout: 1500
            });
        }
    } catch (error) {
        console.error('Error fetching total commissions:', error);
        $q.notify({
            color: 'negative',
            message: 'An error occurred while fetching commissions.',
            position: 'top-right',
            timeout: 1500
        });
    }
};

const confirmTransfer = async () => {
    if (isValidAmount.value) {
        try {
            const amount = parseFloat(transferAmount.value);
            console.log('Sending transfer request with:', { userId: authStore.user.id, amount }); // Debugging log
            const response = await fetch('http://localhost:2000/transfer-commissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: authStore.user.id, 
                    amount: amount
                }),
            });

            const result = await response.json();
            console.log('Response from server:', result); // Debugging log

            if (result.success) {
                $q.notify({
                    color: 'positive',
                    message: 'Transfer successful!',
                    position: 'top-right',
                    timeout: 1500
                });

                commissionsBalance.value = result.newCommissionsBalance;
                walletBalance.value = result.newWalletBalance;
            } else {
                $q.notify({
                    color: 'negative',
                    message: result.message || 'Transfer failed.',
                    position: 'top-right',
                    timeout: 1500
                });
            }
        } catch (error) {
            console.error('Error confirming transfer:', error);
            $q.notify({
                color: 'negative',
                message: 'An error occurred during the transfer.',
                position: 'top-right',
                timeout: 1500
            });
        }
    } else {
        $q.notify({
            color: 'negative',
            message: 'Invalid transfer amount',
            position: 'top-right',
            timeout: 1500
        });
    }
};

// Fetch total commissions when the component is mounted
onMounted(() => {
    fetchTotalCommissions();
});
</script>

<style scoped>
.fund-transfer-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.q-toolbar {
    min-height: 50px;
}
 
.q-footer {
    padding-bottom: env(safe-area-inset-bottom);
}

.account-selection {
    position: relative;
    padding-right: 40px;
}

.switch-button {
    position: absolute; 
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>

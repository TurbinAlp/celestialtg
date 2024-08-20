<template>
    <q-page class="withdraw-page q-pa-md">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat round dense icon="arrow_back" @click="goBack" />
                <q-toolbar-title>Withdraw</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <div class="currency-info q-mb-md">
            <q-avatar size="40px" class="q-mr-sm">
                <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT">
            </q-avatar>
            <div>
                <div class="text-weight-bold">USDT</div>
                <div class="text-caption">BEP20 (Binance Smart Chain)</div>
            </div>
        </div>

        <div class="q-mb-md">
            <div class="text-subtitle2 text-blue q-mb-xs">Withdrawal address</div>
            <q-input v-model="withdrawalAddress" outlined dense placeholder="Please enter withdrawal address" />
        </div>

        <div class="q-mb-md">
            <div class="text-subtitle2 q-mb-xs">Amount</div>
            <q-input v-model="amount" outlined dense type="number" />
        </div>

        <div class="text-caption q-mb-md">
            Balance: {{ balance }} USDT
        </div>

        <div class="q-mb-md">
            <div class="text-subtitle2 q-mb-xs">Trading password</div>
            <q-input v-model="tradingPassword" outlined dense :type="showPassword ? 'text' : 'password'">
                <template v-slot:append>
                    <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                        @click="showPassword = !showPassword" />
                </template>
            </q-input>
        </div>

        <div class="text-subtitle2 q-mb-sm">Notes:</div>
        <ol class="text-caption q-ml-md">
            <li>Please check the address carefully</li>
            <li>Withdrawal fee is 5% of the withdrawal amount</li>
            <li>After confirming the withdrawal, please wait patiently. The withdrawal review time is T+1 to T+2 (24-48
                hours)
            </li>
        </ol>

        <div class="fixed-bottom q-pa-md">
            <div class="row justify-between q-mb-sm">
                <div>Actual received:</div>
                <div>{{ actualReceived }} USDT</div>
            </div>
            <div class="row justify-between q-mb-md">
                <div>Fee:</div>
                <div>{{ fee }} USDT</div>
            </div>
            <q-btn label="Confirm" color="primary" class="full-width" @click="confirmWithdrawal" />
        </div>
    </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();

const withdrawalAddress = ref('');
const amount = ref('');
const balance = ref('0.00');
const tradingPassword = ref('');
const showPassword = ref(false);

const actualReceived = computed(() => {
    const withdrawalAmount = parseFloat(amount.value) || 0;
    return Math.max(withdrawalAmount * 0.95, 0).toFixed(2);
});

const fee = computed(() => {
    const withdrawalAmount = parseFloat(amount.value) || 0;
    return (withdrawalAmount * 0.05).toFixed(2);
});

const goBack = () => {
    router.back();
};

const confirmWithdrawal = () => {
    if (!withdrawalAddress.value || !amount.value || !tradingPassword.value) {
        $q.notify({
            color: 'negative',
            message: 'Please fill in all fields'
        });
        return;
    }

    // Perform withdrawal logic here
    $q.notify({
        color: 'positive',
        message: 'Withdrawal request submitted successfully'
    });
};
</script>

<style scoped>
.withdraw-page {
    padding-bottom: 150px;
}

.currency-info {
    display: flex;
    align-items: center;
}

.fixed-bottom {
    background-color: white;
    border-top: 1px solid #e0e0e0;
}
</style>
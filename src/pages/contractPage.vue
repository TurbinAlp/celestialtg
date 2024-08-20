<template>
    <q-page class="q-pa-md bg-grey-10 text-white">
        <q-header elevated class="bg-amber-6 text-black q-shadow-md">
            <q-toolbar>
                <q-btn flat round dense icon="arrow_back" @click="goBack" />
                <q-toolbar-title>Contract</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <div class="text-center q-mt-lg">
            <q-avatar size="100px" font-size="60px" color="green" text-color="white">
                T
            </q-avatar>
        </div>

        <div class="q-mt-md text-white">
            <!-- Amount Input -->
            <div class="row justify-between q-mb-sm">
                <div class="text-subtitle1">Amount</div>
                <q-input
                    v-model.number="amount"
                    type="number"
                    min="10"
                    filled
                    class="input-text-white bg-blue-grey-9"
                    @input="updateDetails"
                />
            </div>

            <!-- Daily ROI -->
            <div class="row justify-between q-mb-sm">
                <div class="text-subtitle1">Daily ROI</div>
                <div class="text-subtitle1 text-white">{{ dailyROI }}%</div>
            </div>

            <!-- Card for Investment Details -->
            <q-card flat class="q-mt-md bg-grey-2 q-rounded-xl bg-blue-grey-9 text-white">
                <q-card-section>
                    <div class="row justify-between q-mb-sm">
                        <div>Period</div>
                        <div>90 days</div>
                    </div>
                    <div class="row justify-between q-mb-sm">
                        <div>Total investment amount</div>
                        <div>{{ amount }} USDT</div>
                    </div>
                    <div class="row justify-between q-mb-sm">
                        <div>Daily earnings</div>
                        <div class="text-white">{{ dailyEarnings }} USDT</div>
                    </div>
                    <div class="row justify-between">
                        <div>Total earnings</div>
                        <div class="text-white">{{ totalEarnings }} USDT</div>
                    </div>
                </q-card-section>
            </q-card>

            <!-- Balance -->
            <div class="row justify-between q-mt-md">
                <div class="text-subtitle1">Balance:</div>
                <div class="text-subtitle1">{{ amount+totalEarnings }}</div>
            </div>

            <q-btn color="primary" class="full-width q-mt-lg" label="Confirm" @click="confirmSubscription" />
        </div>
    </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../store/auth'

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const amount = ref(10);
const userId = authStore.user.id;

const dailyROI = computed(() => {
    if (amount.value < 50) return 2.5;
    if (amount.value < 100) return 2.5;
    return 2.5;
});

const dailyEarnings = computed(() => (amount.value * dailyROI.value) / 100);
const totalEarnings = computed(() => dailyEarnings.value * 90); // assuming 90 days
const totalInvestment = computed(() => amount.value);

const goBack = () => {
    router.back();
};

const confirmSubscription = async () => {
    try {
        const response = await fetch('http://localhost:2000/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount.value,
                userId: userId,
            }),
        });

        if (!response.ok) {
            const text = await response.json();
            $q.notify({
                color: 'negative',
                message: text.message,
            });
            return;
        }

        const data = await response.json();

        if (data.success) {
            $q.notify({
                color: 'positive',
                message: 'Subscription successful! Earnings will be calculated daily.',
            });

            // Additional logic, such as navigating to another page, can be added here
        } else {
            $q.notify({
                color: 'negative',
                message: data.message || 'Subscription failed.',
            });
        }
    } catch (error) {
        console.error('Error confirming subscription:', error);
        $q.notify({
            color: 'negative',
            message: 'An error occurred. Please try again later.',
        });
    }
};
</script>

<style scoped>
.q-toolbar {
    min-height: 50px;
}

.subscription-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.subscription-label {
    font-size: var(--q-font-size-lg);
    margin-right: 10px;
}

.input-text-white .q-input__control {
    color: white;
}
</style>

<template>
    <q-page class="q-pa-md">
        <q-header elevated class=" bg-white text-black">
            <q-toolbar>
                <q-btn flat round dense icon="arrow_back" @click="goBack" />
                <q-toolbar-title>Quantitative</q-toolbar-title>
                <q-btn flat label="My Investments" @click="goToMyInvestments" />
            </q-toolbar>
        </q-header>

        <q-list separator>
            <q-item v-for="fund in funds" :key="fund.name" class="q-py-md" :to="{ name: 'details', params: { id: 1 } }">
                <q-item-section avatar>
                    <q-avatar text-color="white" color="teal">
                        T
                    </q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ fund.name }}</q-item-label>
                    <q-item-label caption>
                        Period: {{ fund.period }} days
                    </q-item-label>
                    <q-item-label caption>
                        Total Quantity: {{ fund.totalQuantity }}
                    </q-item-label>
                    <q-item-label caption>
                        Remaining quantity: {{ fund.remainingQuantity }}
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <div class="text-subtitle2 text-weight-bold">{{ fund.unitPrice }} USDT</div>
                    <div class="text-caption">Unit price</div>
                </q-item-section>
            </q-item>
        </q-list>
    </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const funds = ref([
    { name: 'U.S. Equity Dividend ...', period: 7, totalQuantity: 10000, remainingQuantity: 9999, unitPrice: 50 },
    { name: 'U.S. Dividend Growth...', period: 15, totalQuantity: 10000, remainingQuantity: 9799, unitPrice: 100 },
    { name: 'U.S. Bond Market Fund', period: 30, totalQuantity: 10000, remainingQuantity: 9747, unitPrice: 200 },
    { name: 'Gold Trust Fund', period: 45, totalQuantity: 10000, remainingQuantity: 9876, unitPrice: 300 },
    { name: 'Global Health Fund', period: 1, totalQuantity: 10000, remainingQuantity: 0, unitPrice: 50 },
    { name: 'Asset Allocation Fund', period: 3, totalQuantity: 10000, remainingQuantity: 0, unitPrice: 100 },
]);

const goBack = () => {
    router.back();
};

const goToMyInvestments = () => {
    // Navigate to My Investments page
    // router.push({ name: 'MyInvestments' });
};
</script>

<style scoped>
.q-toolbar {
    min-height: 50px;
}
</style>
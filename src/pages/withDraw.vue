<template>
    <q-page class="q-pa-md">
        <q-header elevated class="bg-white text-black">
            <q-toolbar>
                <q-btn flat round dense icon="arrow_back" @click="goBack" />
                <q-toolbar-title>Withdraw</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <div class="q-mt-lg text-center">
            <div class="text-subtitle1">Balance (USDT)</div>
            <div class="text-h4 text-primary q-mt-sm">0.00</div>
        </div>

        <div class="q-mt-lg">
            <div class="text-subtitle2 q-mb-sm">Select network</div>
            <q-list bordered separator>
                <q-item v-for="network in networks" :key="network.name" clickable v-ripple
                    @click="selectNetwork(network)" :to="{ name: 'withdraw-address' }">
                    <q-item-section avatar>
                        <q-avatar>
                            <img :src="network.icon" :alt="network.name">
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        {{ network.name }}
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="chevron_right" />
                    </q-item-section>
                </q-item>
            </q-list>
        </div>
    </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const networks = ref([
    { name: 'BEP20 (Binance Smart Chain)', icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png' },
    { name: 'TRC20 (Tron)', icon: 'https://cryptologos.cc/logos/tron-trx-logo.png' },
    { name: 'ERC20 (Ethereum)', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
]);

const goBack = () => {
    router.back();
};

const selectNetwork = (network) => {
    // Handle network selection
    console.log('Selected network:', network.name);
    // You can navigate to a new page or open a modal here
};
</script>

<style scoped>
.q-toolbar {
    min-height: 50px;
}
</style>
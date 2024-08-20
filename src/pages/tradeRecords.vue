<template>
    <q-page class="q-pa-md">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat round dense icon="arrow_back" @click="goBack" />
                <q-toolbar-title>Fund Records</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <div class="column items-center justify-center" style="height: calc(100vh - 50px);">
            <q-icon name="account_balance_wallet" size="100px" color="grey-4" />
            <div class="text-grey q-mt-md">No records</div>
        </div>
    </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
    router.back();
};
</script>

<style scoped>
.q-toolbar {
    min-height: 50px;
}
</style>
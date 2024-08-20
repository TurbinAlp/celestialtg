<template>
    <q-page class="q-pa-md">
        <div class="text-h6 q-mb-md text-center">Positions</div>

        <!-- Derivatives account balance card -->
        <q-card class="bg-blue-6 text-white q-mb-md">
            <q-card-section>
                <div class="row items-center justify-between q-mb-sm">
                    <div>Derivatives account balance (USDT)</div>
                    <q-btn flat round dense icon="info_outline" size="xs" :to="'/traderecords'" />
                </div>

                <div class="text-h5 q-mb-md">0.00</div>
                <div class="row justify-between">
                    <div>
                        <div class="text-caption">Available balance (USDT)</div>
                        <div>0.00</div>
                    </div>
                    <div>
                        <div class="text-caption">Unrealized P/L (USDT)</div>
                        <div>0.00</div>
                    </div>
                </div>
            </q-card-section>
        </q-card>

        <!-- Current positions section -->
        <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1">Current positions</div>
            <q-btn flat round dense icon="timeline" color="grey" :to="'currentPosition'" />
        </div>

        <!-- No records placeholder -->
        <div class="column items-center justify-center" style="height: 300px;">
            <q-icon name="laptop" size="100px" color="grey-4" />
            <div class="text-grey q-mt-md">No records</div>
        </div>
    </q-page>
    <FooterComponent />
</template>

<script setup>
import FooterComponent from '../components/footerComponent.vue'
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
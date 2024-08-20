<template>
    <q-page class="q-pa-md bg-grey-10 text-white">
        <div class="row q-col-gutter-md" style="width: 100%;">
            <!-- Crypto List -->
            <div class="col-12 ">
                <q-card flat bordered class="bg-blue-grey-9 text-white">
                    <q-tabs v-model="activeTab" dense class="text-grey" active-color="white" indicator-color="amber-6"
                        align="justify" narrow-indicator>
                        <q-tab name="crypto" label="Crypto" />
                        <q-tab name="forex" label="Forex" />
                        <q-tab name="commodity" label="Commodity" />
                        <q-tab name="index" label="Index" />
                    </q-tabs>

                    <q-separator />

                    <q-tab-panels v-model="activeTab" animated class="bg-blue-grey-8 text-white"> 
                        <q-tab-panel name="crypto">
                            <q-list separator>
                                <q-item v-for="item in cryptoList" :key="item.symbol">
                                    <q-item-section avatar>
                                        <q-avatar size="28px" font-size="12px" :color="item.color" text-color="white">
                                            {{ item.symbol.slice(0, 1) }}
                                        </q-avatar>
                                    </q-item-section>
                                    <q-item-section class="text-white">
                                        <q-item-label>{{ item.name }}</q-item-label>
                                        <q-item-label caption class="text-grey">{{ item.symbol }}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <div class="text-weight-bold text-white">{{ item.price }}</div>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-chip :color="item.change >= 0 ? 'green' : 'red'" text-color="white"
                                            size="sm">
                                            {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
                                        </q-chip>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-tab-panel>

                        <q-tab-panel name="forex">
                            <div class="text-h6">Forex content</div>
                        </q-tab-panel>

                        <q-tab-panel name="commodity">
                            <div class="text-h6">Commodity content</div>
                        </q-tab-panel>

                        <q-tab-panel name="index">
                            <div class="text-h6">Index content</div>
                        </q-tab-panel>
                    </q-tab-panels>
                </q-card>
            </div>
        </div>
    </q-page>
    <FooterComponent />

</template>

<script setup>
import { ref, reactive } from 'vue';
import FooterComponent from '../components/footerComponent.vue'

const activeTab = ref('crypto');

const cryptoList = reactive([
    { name: 'Bitcoin', symbol: 'BTC/USDT', price: '57872.17', change: 1.13, color: 'orange' },
    { name: 'Litecoin', symbol: 'WLC/USDT', price: '1630.5', change: 0.46, color: 'blue' },
    { name: 'Cardano', symbol: 'ADA/USDT', price: '0.335', change: -0.21, color: 'purple' },
    { name: 'Cosmos', symbol: 'ATOM/USDT', price: '4.987', change: -0.02, color: 'black' },
    { name: 'Avalanche', symbol: 'AVAX/USDT', price: '39.77', change: 0.01, color: 'red' }
]);
</script>
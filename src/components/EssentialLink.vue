<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Total Assets -->
      <div class="col-12">
        <div class="text-caption">Total assets (USDT)</div>
        <div class="text-h5">{{ totalAssets }}</div>
        <q-btn color="primary" label="Deposit" @click="handleDeposit" />
      </div>

      <!-- Quantitative Funds Card -->
      <div class="col-12">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h6">GTFX QUANTITATIVE FUNDS</div>
            <div class="text-subtitle2">with no risk</div>
            <div class="text-subtitle2">30% annual returns</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Navigation Icons -->
      <div class="col-12">
        <div class="row justify-between">
          <q-btn v-for="nav in navigationItems" :key="nav.label" flat round color="primary" :icon="nav.icon" />
        </div>
        <div class="row justify-between text-caption q-mt-sm">
          <span v-for="nav in navigationItems" :key="nav.label">{{ nav.label }}</span>
        </div>
      </div>

      <!-- Market Overview -->
      <div class="col-12">
        <div class="row q-col-gutter-sm">
          <div v-for="market in marketOverview" :key="market.symbol" class="col-4">
            <q-chip :icon="market.icon" :color="market.color" text-color="white">
              {{ market.symbol }}
              <div class="column">
                <span>{{ market.price }}</span>
                <span :class="market.change >= 0 ? 'text-positive' : 'text-negative'">
                  {{ market.change >= 0 ? '+' : '' }}{{ market.change }}%
                </span>
              </div>
            </q-chip>
          </div>
        </div>
      </div>

      <!-- Crypto List -->
      <div class="col-12">
        <q-list bordered separator>
          <q-item v-for="crypto in cryptoList" :key="crypto.symbol">
            <q-item-section avatar>
              <q-avatar :color="crypto.color" text-color="white">
                {{ crypto.symbol[0] }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ crypto.name }}</q-item-label>
              <q-item-label caption>{{ crypto.symbol }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="text-weight-bold">{{ crypto.price }}</div>
              <div :class="crypto.change >= 0 ? 'text-positive' : 'text-negative'">
                {{ crypto.change >= 0 ? '+' : '' }}{{ crypto.change }}%
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue';

const totalAssets = ref('0.00');

const navigationItems = reactive([
  { icon: 'bar_chart', label: 'Quantify' },
  { icon: 'description', label: 'Contracts' },
  { icon: 'share', label: 'Referral' },
  { icon: 'newspaper', label: 'News' },
  { icon: 'casino', label: 'Lucky Draw' }
]);

const marketOverview = reactive([
  { symbol: 'BTC/USDT', price: '57872.17', change: 1.13, icon: 'currency_bitcoin', color: 'orange' },
  { symbol: 'EUR/USD', price: '1.0903', change: -0.22, icon: 'euro_symbol', color: 'primary' },
  { symbol: 'XAU/USD', price: '2407.08', change: 0.93, icon: 'attach_money', color: 'green' }
]);

const cryptoList = reactive([
  { name: 'Bitcoin', symbol: 'BTC/USDT', price: '57872.17', change: 1.13, color: 'orange' },
  { name: 'Litecoin', symbol: 'WLC/USDT', price: '1630.5', change: 0.46, color: 'blue' },
  { name: 'Cardano', symbol: 'ADA/USDT', price: '0.335', change: -0.21, color: 'purple' },
  { name: 'Cosmos', symbol: 'ATOM/USDT', price: '4.987', change: -0.02, color: 'black' },
  { name: 'Avalanche', symbol: 'AVAX/USDT', price: '39.77', change: 0.01, color: 'red' }
]);

const handleDeposit = () => {
  // Implement deposit logic here
  console.log('Deposit button clicked');
};
</script>
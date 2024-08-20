<template>
    <q-page class="q-pa-md bg-grey-10">
      <q-header elevated class="bg-amber-6 text-black">
        <q-toolbar>
          <q-avatar>
            <img src="../assets/CTG Official Logo.png" alt="Celestrial Trading Group (CTG)" />
          </q-avatar>
          <q-toolbar-title>Celestrial Trading Group</q-toolbar-title>
          <q-btn icon="headset" round flat />
        </q-toolbar>
      </q-header>
  
      <div class="row q-col-gutter-md ">
        <!-- Total Assets -->
        <div class="col-12">
          <q-card flat bordered>
            <q-card-section class="text-white bg-blue-grey-9">
              <div class="row items-center justify-between">
                <div class="column">
                  <div class="text-caption">Total assets (USDT)</div>
                  <div class="text-h5">{{ totalAssets }}</div>
                </div>
                <div>
                  <q-btn class="text-black" color="amber-6" label="Deposit" :to="'/deposit'" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
  
        <!-- Quantitative Funds Card -->
        <div class="col-12">
          <q-card class="bg-blue-grey-9 text-white">
            <q-card-section>
              <div class="text-h6">Besa QUANTITATIVE FUNDS</div>
              <div class="text-subtitle2">with no risk</div>
              <div class="text-subtitle2">30% annual returns</div>
            </q-card-section>
          </q-card>
        </div>
  
        <!-- Navigation Icons -->
        <div class="col-12 text-white">
          <div class="row q-col-gutter-sm justify-around">
            <div v-for="nav in navigationItems" :key="nav.label" class="col-2 text-center">
              <q-btn flat round color="amber-6" :icon="nav.icon" class="q-mb-sm" :to="nav.link" />
              <div class="text-caption">{{ nav.label }}</div>
            </div>
          </div>
        </div>
  
        <!-- Market Overview -->
        <div class="row q-col-gutter-md">
          <div v-for="(market, index) in marketOverview" :key="index" class="col-6">
            <q-card :class="market.change >= 0 ? 'bg-light-green-1' : 'bg-pink-1'" flat bordered>
              <q-card-section class="q-pa-sm">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-subtitle2 text-weight-bold">{{ market.symbol }}</div>
                    <div class="text-h6">{{ market.price }}</div>
                  </div>
                  <div class="col-auto">
                    <q-chip :color="market.change >= 0 ? 'green' : 'red'" text-color="white" size="sm">
                      {{ market.change >= 0 ? '+' : '' }}{{ market.change }}%
                    </q-chip>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
  
        <!-- Crypto List -->
        <div class="col-12">
          <q-card flat bordered class="bg-blue-grey-9 text-white">
            <q-tabs v-model="activeTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
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
                      <q-chip :color="item.change >= 0 ? 'green' : 'red'" text-color="white" size="sm">
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
  import { ref, reactive, onMounted } from 'vue';
  import FooterComponent from '../components/footerComponent.vue';
  import { useAuthStore } from '../store/auth';
  
  const totalAssets = ref('0.00');
  const activeTab = ref('crypto');
  const authStore = useAuthStore();
  
  const navigationItems = reactive([
    { icon: 'description', label: 'Contracts', link: 'contract' },
    { icon: 'share', label: 'Referral', link: 'refferal' },
    { icon: 'newspaper', label: 'News', link: 'news' },
  ]);
  
  const marketOverview = ref([]);
  
  const cryptoList = ref([]);
  
  const fetchCryptoData = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');

    if (!response.ok) {
      // Handle non-200 responses
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Unexpected data format received from API');
    }

    marketOverview.value = data.slice(0, 3).map(coin => ({
      symbol: `${coin.symbol.toUpperCase()}/USDT`,
      price: coin.current_price,
      change: coin.price_change_percentage_24h,
    }));

    cryptoList.value = data.map(coin => ({
      name: coin.name,
      symbol: `${coin.symbol.toUpperCase()}/USDT`,
      price: coin.current_price,
      change: coin.price_change_percentage_24h,
      color: 'orange', // You can set colors based on the coin or leave it as is
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
  }
};

const fetchUserData = async () => {
    try {
        const response = await fetch(`http://localhost:2000/user/${authStore.user.id}`);
        const result = await response.json();
        totalAssets.value = result.data.asset

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
    fetchCryptoData();
    fetchUserData();
  });
  </script>
  
  <style scoped>
  .q-item {
    padding: 8px 0;
  }
  
  /* Additional styling omitted for brevity */
  </style>
  
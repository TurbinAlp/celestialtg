<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container color="grey-10">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>

import { useRouter, useRoute } from 'vue-router';
import { ref, reactive } from 'vue';

const router = useRouter();
const route = useRoute();

const bottomTabs = reactive([
  { name: 'home', icon: 'home', label: 'Home' },
  { name: 'markets', icon: 'show_chart', label: 'Markets' },
  { name: 'trade', icon: 'currency_exchange', label: 'Trade' },
  { name: 'news', icon: 'article', label: 'news' },
  { name: 'mine', icon: 'person', label: 'Mine' }
]);

const navigateTo = (tabName) => {
  if (tabName === 'home') router.push('/')
  else if (tabName === 'markets') router.push('/market')
  else if (tabName === 'trade') router.push('/trade')
  else if (tabName === 'news') router.push('/news')
  else if (tabName === 'mine') router.push('/profile')
  // Handle other tabs as necessary
};

const isActiveTab = (tabName) => {
  if (tabName === 'home' && route.path === '/') return true
  if (tabName === 'markets' && route.path === '/market') return true
  if (tabName === 'trade' && route.path === '/trade') return true
  if (tabName === 'news' && route.path === '/news') return true
  if (tabName === 'mine' && route.path === '/profile') return true
  return false;
};


const handleDeposit = () => {
  // Implement deposit logic here
  console.log('Deposit button clicked');
};

</script>

<style scoped>
.q-item {
  padding: 8px 0;
}

.q-tabs .q-tab.text-primary {
  color: var(--q-color-primary) !important;
}
</style>
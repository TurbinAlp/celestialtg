<template>
    <q-page class="records-page">
      <q-header class="bg-white text-black">
        <q-toolbar>
          <q-btn flat round dense icon="arrow_back" @click="goBack" />
          <q-tabs v-model="activeTab" dense class="text-grey" active-color="primary" indicator-color="primary"
            align="left" narrow-indicator>
            <q-tab name="deposit" label="Deposit Records" />
            <q-tab name="withdrawal" label="Withdrawal Records" />
          </q-tabs>
        </q-toolbar>
      </q-header>
  
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="deposit">
          <div v-if="depositRecords.length === 0" class="no-records-container">
            <q-icon name="account_balance_wallet" size="100px" color="grey-4" />
            <div class="text-grey q-mt-md">No records</div>
          </div>
          <div v-else>
            <q-list>
              <q-item v-for="record in depositRecords" :key="record.id">
                <q-item-section>
                  <q-item-label>Amount: ${{ record.amount }}</q-item-label>
                  <q-item-label caption>Status: {{ record.status }}</q-item-label>
                  <q-item-label caption>Date: {{ record.created_at }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-tab-panel>
  
        <q-tab-panel name="withdrawal">
          <div v-if="withdrawalRecords.length === 0" class="no-records-container">
            <q-icon name="account_balance_wallet" size="100px" color="grey-4" />
            <div class="text-grey q-mt-md">No records</div>
          </div>
          <div v-else>
            <q-list>
              <q-item v-for="record in withdrawalRecords" :key="record.id">
                <q-item-section>
                  <q-item-label>Amount: ${{ record.amount }}</q-item-label>
                  <q-item-label caption>Status: {{ record.status }}</q-item-label>
                  <q-item-label caption>Date: {{ record.created_at }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../store/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  const activeTab = ref('deposit');
  
  const depositRecords = ref([]);
  const withdrawalRecords = ref([]);
  
  const goBack = () => {
    router.back();
  };
  
  const fetchRecords = async () => {
    try {
      const [depositsResponse, withdrawalsResponse] = await Promise.all([
        fetch(`http://localhost:2000/transactions/deposit/${authStore.user.id}`),
        fetch(`http://localhost:2000/transactions/withdrawal/${authStore.user.id}`)
      ]);
  
      const deposits = await depositsResponse.json();
      const withdrawals = await withdrawalsResponse.json();
  
      depositRecords.value = deposits;
      withdrawalRecords.value = withdrawals;
    } catch (error) {
      console.error('Error fetching transaction records:', error);
    }
  };
  
  onMounted(fetchRecords);
  </script>
  
  <style scoped>
  .records-page {
    background-color: #f5f5f5;
    min-height: 100vh;
  }
  
  .q-toolbar {
    min-height: 50px;
  }
  
  .no-records-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 100px);
  }
  
  .q-icon {
    opacity: 0.5;
  }
  </style>
  
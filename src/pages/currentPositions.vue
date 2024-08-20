<template>
    <q-page class="q-pa-md bg-grey-10 text-white">
      <q-header class="bg-amber-6 text-black">
        <q-toolbar>
          <q-btn flat round dense icon="arrow_back" @click="goBack" />
          <q-toolbar-title>Positions</q-toolbar-title>
        </q-toolbar>
      </q-header>
  
      <q-tabs v-model="tab" dense class="text-grey" active-color="white" indicator-color="white" align="justify" narrow-indicator>
        <q-tab name="inProgress" label="In Progress" />
        <q-tab name="completed" label="Completed" />
      </q-tabs>
  
      <q-separator />
  
      <q-tab-panels v-model="tab" animated class="bg-blue-grey-9">
        <q-tab-panel name="inProgress">
          <q-table
            :rows="activeSubscriptions"
            :columns="activeColumns"
            row-key="id"
            class="q-mb-md"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in activeColumns" :key="col.name" :props="props">
                  {{ col.field(props.row) }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>
  
        <q-tab-panel name="completed">
          <q-table
            :rows="completedProfits"
            :columns="completedColumns"
            row-key="id"
            class="q-mb-md"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in completedColumns" :key="col.name" :props="props">
                  {{ col.field(props.row) }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const router = useRouter();
const tab = ref('inProgress');
const activeSubscriptions = ref([]);
const completedProfits = ref([]);
const authStore = useAuthStore();
const userId = authStore.user.id;

const activeColumns = [
  { name: 'id', label: 'ID', align: 'left', field: row => row.id },
  { name: 'amount', label: 'Amount', align: 'left', field: row => row.amount },
  { name: 'startDate', label: 'Start Date', align: 'left', field: row => row.startDate },
  { name: 'endDate', label: 'End Date', align: 'left', field: row => row.endDate },
  { name: 'status', label: 'Status', align: 'left', field: row => row.status }
];

const completedColumns = [
    { name: 'date', label: 'Date', align: 'left', field: row => row.date },
    { name: 'Profit', label: 'Amount', align: 'left', field: row => row.amount },
];

const goBack = () => {
  router.back();
};

const fetchActiveSubscriptions = async () => {
  try {
    const response = await fetch(`http://localhost:2000/subscriptions/active/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    activeSubscriptions.value = data; // Ensure data is assigned to the ref
    console.log('Active Subscriptions Data:', data);
  } catch (error) {
    console.error('Failed to fetch active subscriptions:', error);
  }
};

const fetchCompletedProfits = async () => {
  try {
    const response = await fetch(`http://localhost:2000/profits/completed/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    completedProfits.value = data;
    console.log('Completed Profits Data:', data);
  } catch (error) {
    console.error('Failed to fetch completed profits:', error);
  }
};

onMounted(() => {
  fetchActiveSubscriptions();
  fetchCompletedProfits();
});
</script>

  
  <style scoped>
  .q-toolbar {
    min-height: 50px;
  }
  </style>
  
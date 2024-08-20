<template>
  <q-page class="bg-dark text-white q-pa-md">
    <!-- Header with Back Button -->
    <q-header class="bg-dark text-white">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" @click="goBack" />
        <q-toolbar-title>Rebate Records</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Team Members Card -->
    <q-card class="bg-primary text-white q-mt-md">
      <q-card-section class="row justify-between">
        <div class="column items-center">
          <div class="text-h6">{{ teamMembers }}</div>
          <div class="text-caption">Team members</div>
        </div>
        <div class="column items-center">
          <div class="text-h6">{{ totalEarnings }}</div>
          <div class="text-caption">Total earnings</div>
        </div>
      </q-card-section>
    </q-card>

    <!-- People List Table with Click Handling -->
    <q-card class="bg-grey-9 q-mt-md">
      <q-table
        :rows="relationshipRows"
        :columns="relationshipColumns"
        row-key="relationship"
        hide-bottom
        flat
        dark
        dense
        @row-click="(event, row) => handleRowClick(event, row)"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const router = useRouter();
const authStore = useAuthStore();

const goBack = () => {
  router.back();
};

const teamMembers = ref(0);
const totalEarnings = ref(0.00);

const fetchInviteData = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) {
      throw new Error('User ID is not available');
    }

    const response = await fetch(`http://localhost:2000/invite/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    teamMembers.value = data.teamMembers;
    totalEarnings.value = data.totalEarnings;
    totalCommission.value = data.totalEarnings;

    relationshipRows.value = [
      { relationship: 'Level 1', level: 1, number: data.level1Members, todaysCommission: '0.00', totalCommission: '0.00' },
      { relationship: 'Level 2', level: 2, number: data.level2Members, todaysCommission: '0.00', totalCommission: '0.00' },
      { relationship: 'Level 3', level: 3, number: data.level3Members, todaysCommission: '0.00', totalCommission: '0.00' },
    ];
  } catch (error) {
    console.error('Failed to fetch data', error);
  }
};

onMounted(fetchInviteData);

const relationshipColumns = [
  { name: 'relationship', align: 'left', label: 'Relationship', field: 'relationship' },
  { name: 'number', align: 'center', label: 'Number of people', field: 'number' },
  { name: 'todaysCommission', align: 'right', label: "Today's commission", field: 'todaysCommission' },
  { name: 'totalCommission', align: 'right', label: 'Total commission', field: 'totalCommission' },
];

const relationshipRows = ref([]);

const handleRowClick = (event, row) => {
  console.log('Event:', event);
  console.log('Row:', row); 
  if (row.level !== undefined) {
    router.push({
      path: '/onareferal',
      query: { level: row.level }
    });
  } else {
    console.error('Level is undefined in the row:', row);
  }
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>

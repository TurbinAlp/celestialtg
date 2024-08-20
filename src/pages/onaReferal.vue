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
      <!-- <q-card class="bg-primary text-white q-mt-md">
        <q-card-section class="row justify-between">
          <div class="column items-center">
            <div class="text-h6">{{ teamMembers }}</div>
            <div class="text-caption">Team members</div>
          </div>
        </q-card-section>
      </q-card> -->
  
      <!-- People List Table -->
      <q-card class="bg-grey-9 q-mt-md">
        <q-table :rows="peopleRows" :columns="peopleColumns" row-key="id" hide-bottom flat dark dense />
      </q-card>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from '../store/auth';
  
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  
  const goBack = () => {
    router.back();
  };
  
  const teamMembers = ref(0);
  const peopleRows = ref([]);
  const level = ref(parseInt(route.query.level) || null);
  
  // Fetch data from API and handle errors
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
  
      teamMembers.value = data.teamMembers || 0;
  
      // Filter people based on the level parameter from the URL
      peopleRows.value = data.people
        .filter(person => level.value === null || person.level === level.value)
        .map(person => ({
          id: person.id || 'N/A',
          userName: person.userName || 'N/A',
          phoneNumber: person.phone || 'N/A',
          email: person.email || 'N/A',
          level: person.level || 'N/A'
        }));
    } catch (error) {
      console.error('Failed to fetch data', error);
      peopleRows.value = [];
    }
  };
  
  // Watch for changes in the route query
  watch(() => route.query.level, (newLevel) => {
    level.value = parseInt(newLevel) || null;
    fetchInviteData();
  }, { immediate: true });
  
  onMounted(() => {
    fetchInviteData();
  });
  
  const peopleColumns = [
    { name: 'userName', align: 'left', label: 'User Name', field: 'userName' },
    { name: 'phoneNumber', align: 'left', label: 'Phone Number', field: 'phoneNumber' },
    { name: 'email', align: 'left', label: 'Email', field: 'email' },
    { name: 'level', align: 'left', label: 'Level', field: 'level' }
  ];
  </script>
  
  <style scoped>
  /* Add any additional styles if needed */
  </style>
  
<template>
    <q-page class="q-pa-md bg-grey-10">
      <q-tabs v-model="tab" dense class="text-grey" active-color="blue-grey-2" indicator-color="amber-6" align="justify" narrow-indicator>
        <q-tab name="announcement" label="Announcement" />
        <q-tab name="event" label="Event" />
      </q-tabs>
  
      <q-separator />
  
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="announcement" class="bg-blue-grey-9 text-white">
          <q-list separator>
            <q-item v-for="(announcement, index) in announcements" :key="index" clickable v-ripple :to="`/newsdetail/${announcement.id}`">
              <q-item-section>
                <q-item-label>{{ announcement.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
  
        <q-tab-panel name="event">
          <div class="text-h6">Event content goes here</div>
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
    <FooterComponent />
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import FooterComponent from '../components/footerComponent.vue'
  
  const tab = ref('announcement');
  const announcements = ref([]);
  
  onMounted(async () => {
    try {
      const response = await fetch('http://localhost:2000/announcements');
      const data = await response.json();
      announcements.value = data;
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  });
  </script>
  
  <style scoped>
  /* Add any additional styles if needed */
  </style>
  
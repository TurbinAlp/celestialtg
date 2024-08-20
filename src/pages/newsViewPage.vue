<template>
    <q-page class="q-pa-md bg-grey-10 text-white">
      
      <q-card flat bordered v-if="announcement">
        <q-card-section class="bg-blue-grey-9">
          <div class="text-h6 q-mb-md">{{ announcement.title }}</div>
          <div class="text-caption text-grey q-mb-lg">{{ announcement.date }}</div>
  
          <!-- Use Quasar classes for proper text wrapping -->
          <div class="text-body1 q-mb-md q-pa-xs text-wrap">{{ announcement.description }}</div>
  
          <div class="text-body1 q-mb-md q-pa-xs text-wrap">
            {{ announcement.details }}
          </div>
  
          <div class="q-mt-lg">{{ announcement.footer }}</div>
          <div>{{ announcement.dateFooter }}</div>
          <div class="text-caption text-grey q-mt-md">{{ announcement.note }}</div>
        </q-card-section>
      </q-card>
    </q-page>
    <FooterComponent />
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import FooterComponent from '../components/footerComponent.vue'
  
  const route = useRoute();
  const router = useRouter();
  const announcement = ref(null);
  

  
  onMounted(async () => {
    const announcementId = route.params.id;
  
    try {
      const response = await fetch(`http://localhost:2000/announcements/${announcementId}`);
      
      if (response.ok) {
        const data = await response.json();
        // Ensure description is a string
        console.log(data);
        if (data.description && typeof data.description !== 'string') {
          data.description = String(data.description);
        }
        announcement.value = data;
      } else {
        console.error('Failed to fetch announcement details:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch announcement details:', error);
    }
  });
  </script>
  
  <style scoped>
  /* You can add additional styles here if necessary, but Quasar classes should handle most cases */
  </style>
  
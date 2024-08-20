<template>
    <q-page class="bg-dark text-white q-pa-md">
      <q-header class="bg-dark text-white">
        <q-toolbar>
          <q-btn flat round dense icon="arrow_back" @click="goBack" />
          <q-toolbar-title>Invite Friends</q-toolbar-title>
        </q-toolbar>
      </q-header>
  
      <div class="q-mt-lg">
        <q-card class="bg-primary text-white text-center q-pa-md">
          <div class="text-h6">{{ referralCode }}</div>
          <div class="row q-mt-sm">
            <q-btn color="white" text-color="primary" class="col q-mr-sm" label="Copy Invitation Code"
              @click="copyInvitationCode" />
            <q-btn color="red" text-color="white" class="col" label="Transfer CommissionsL" :to="'/trcommissions'" />
          </div>
        </q-card>
      </div>
  
      <div class="q-mt-lg">
        <div class="text-subtitle1">My promotions</div>
        <q-card class="bg-grey-9 q-pa-md">
          <div class="row justify-between">
            <div class="column items-center">
              <div class="text-h6">{{ teamMembers }}</div>
              <div class="text-caption">Team members</div>
            </div>
            <div class="column items-center">
              <div class="text-h6">{{ totalCommission }}</div>
              <div class="text-caption">Total earnings</div>
            </div>
          </div>
          <q-btn color="primary" class="full-width q-mt-sm" label="Rebate Records" :to="'/rebate'" />
        </q-card>
      </div>
  
      <div class="q-mt-lg">
        <q-list>
          <q-item v-for="(tier, index) in balanceTiers" :key="index" class="bg-grey-9 q-mb-sm">
            <q-item-section>
              <div class="row items-center">
                <q-icon name="military_tech" size="md" color="yellow" class="q-mr-sm" />
                <div>
                  <div>Balance: {{ tier.balance }} USDT</div>
                  <div>Condition: {{ tier.condition }}</div>
                  <div>Direct friends: {{ tier.directFriends }}</div>
                  <div>Indirect friends: {{ tier.indirectFriends }}</div>
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAuthStore } from '../store/auth'
  
  const router = useRouter();
  const $q = useQuasar();
  const authStore = useAuthStore();
  
  const invitationCode = ref('');
  const teamMembers = ref(0);
  const totalEarnings = ref(0);
  const totalCommission = ref(0);
  const balanceTiers = ref([]);
  const referralCode = ref(''); 
  
  const goBack = () => {
    router.back();
  };
  
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

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    invitationCode.value = data.invitationCode;
    teamMembers.value = data.teamMembers;
    totalEarnings.value = data.totalEarnings;
    totalCommission.value = data.totalCommission;
  } catch (error) {
    console.error('Failed to fetch data', error);
    $q.notify({
      message: 'Failed to fetch invite data',
      color: 'negative'
    });
  }
};

  
  const copyInvitationCode = () => {
    navigator.clipboard.writeText(referralCode.value);
    $q.notify({
      message: 'Invitation code copied to clipboard',
      color: 'positive'
    });
  };
  
  const copyURL = () => {
    const inviteURL = `https://example.com/invite/${referralCode.value}`;
    navigator.clipboard.writeText(inviteURL);
    $q.notify({
      message: 'Invitation URL copied to clipboard',
      color: 'positive'
    });
  };

  const fetchReferralCode = async () => {
  try {
    const userId = authStore.user?.id; 
    if (!userId) {
      throw new Error('User ID is not available');
    }

    const response = await fetch(`http://localhost:2000/referral/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    referralCode.value = data.referralCode; // Store referral code in ref

  } catch (error) {
    console.error('Failed to fetch referral code', error);
    $q.notify({
      message: 'Failed to fetch referral code',
      color: 'negative'
    });
  }
};
  
onMounted(() => {
  fetchInviteData();
  fetchReferralCode();
});
  </script>
  
  <style scoped>
  /* Add any additional styles if needed */
  </style>
  
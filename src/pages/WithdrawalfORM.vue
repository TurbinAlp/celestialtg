<template>
    <q-page class="bg-grey-2">
      <q-header class="bg-white text-black">
        <q-toolbar>
          <q-btn flat round dense icon="arrow_back" @click="goBack" />
          <q-toolbar-title>Withdrawal</q-toolbar-title>
        </q-toolbar>
      </q-header>
  
      <div class="q-pa-md">
        <q-input
          v-model="withdrawalAmount"
          type="number"
          min="5"
          label="Amount"
          hint="Minimum withdrawal is $5"
          class="q-mb-md"
        />
  
        <q-input
          v-model="withdrawalAddress"
          label="Withdrawal Address"
          hint="Enter your withdrawal address"
          class="q-mb-md"
        />
  
        <q-btn
          color="primary"
          label="Withdraw"
          @click="processWithdrawal"
          class="full-width"
        />
      </div>
  
      <q-dialog v-model="showSuccess">
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Success</div>
            <p>Your withdrawal request has been processed successfully.</p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Close" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
  
      <q-dialog v-model="showError">
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">FAIL</div>
            <p>{{ errorMessage }}</p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Close" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useQuasar } from 'quasar';
  import { useAuthStore } from '../store/auth';
  import { useRouter } from 'vue-router';
  
  const $q = useQuasar();
  const router = useRouter();
  const authStore = useAuthStore();
  
  const withdrawalAmount = ref('');
  const withdrawalAddress = ref('');
  const showSuccess = ref(false);
  const showError = ref(false);
  const errorMessage = ref('');
  
  const goBack = () => {
    router.back();
  };
  
  const processWithdrawal = async () => {
    const amount = parseFloat(withdrawalAmount.value);
    const address = withdrawalAddress.value.trim();
  
    if (isNaN(amount) || amount < 5) {
      $q.notify({
        color: 'negative',
        message: 'Minimum withdrawal amount is $5.',
        position: 'top-right',
      });
      return;
    }
  
    if (!address) {
      $q.notify({
        color: 'negative',
        message: 'Please provide a withdrawal address.',
        position: 'top-right',
      });
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:2000/withdrawal/${authStore.user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, address }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        showSuccess.value = true;
        withdrawalAmount.value = '';
        withdrawalAddress.value = '';
      } else {
        errorMessage.value = result.message || 'Failed to process withdrawal.';
        showError.value = true;
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      $q.notify({
        color: 'negative',
        message: 'Error processing withdrawal.',
        position: 'top-right',
      });
    }
  };
  </script>
  
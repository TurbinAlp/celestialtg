<template>
    <q-page padding>
      <q-header class="bg-primary text-white">
        <q-toolbar>
          <q-btn flat round dense icon="arrow_back" @click="goBack" />
          <q-toolbar-title>Deposit</q-toolbar-title>
        </q-toolbar>
      </q-header>
  
      <q-card class="deposit-form q-pa-md">
        <q-card-section>
          <div class="text-h6">Make a Deposit</div>
        </q-card-section>
  
        <q-card-section>
          <q-form @submit="createTransaction" class="q-gutter-md">
            <q-input
              v-model.number="amount"
              type="number"
              label="Amount (USD)"
              filled
              :rules="[val => val > 0 || 'Amount must be greater than 0']"
            />
  
            <q-select
              v-model="currency"
              :options="currencyOptions"
              label="Currency"
              filled
              emit-value
              map-options
            />
  
            <q-btn
              label="Deposit"
              type="submit"
              color="primary"
              :loading="loading"
            />
          </q-form>
        </q-card-section>
      </q-card>
  
      <q-dialog v-model="showEmailWarning" persistent>
        <q-card class="email-warning">
          <q-card-section>
            <div class="text-h6 text-negative">Warning</div>
          </q-card-section>
  
          <q-card-section>
            <p>You should update your profile to fill in the email address.</p>
          </q-card-section>
  
          <q-card-actions align="right">
            <q-btn flat label="Go to Account" color="primary" @click="redirectToAccount" />
          </q-card-actions>
        </q-card>
      </q-dialog>
  
      <q-dialog v-model="showTransactionDetails">
        <q-card class="transaction-details">
          <q-card-section>
            <div class="text-h6">Transaction Created</div>
          </q-card-section>
  
          <q-card-section v-if="transactionDetails">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Amount</q-item-label>
                  <q-item-label caption>{{ transactionDetails.amount }} {{ transactionDetails.coin }}</q-item-label>
                </q-item-section>
              </q-item>
  
              <q-item>
                <q-item-section>
                  <q-item-label>Address</q-item-label>
                  <q-item-label caption>{{ transactionDetails.address }}</q-item-label>
                </q-item-section>
              </q-item>
  
              <q-item>
                <q-item-section>
                  <q-item-label>Confirmation URL</q-item-label>
                  <q-item-label caption>
                    <a :href="transactionDetails.status_url" target="_blank">View Status</a>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
  
          <q-card-actions align="right">
            <q-btn flat label="Close" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <FooterComponent/>
    </q-page>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import FooterComponent from '../components/footerComponent.vue';
  import { useAuthStore } from '../store/auth';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'DepositForm',
  
    setup() {
      const $q = useQuasar();
      const router = useRouter();
      const amount = ref(null);
      const currency = ref('USDT.BEP20');
      const loading = ref(false);
      const transactionDetails = ref(null);
      const showTransactionDetails = ref(false);
      const showEmailWarning = ref(false); // Define showEmailWarning here
      const authStore = useAuthStore();
      const email = ref('');
  
      const currencyOptions = [
        { label: 'Tether USD (BEP20)', value: 'USDT.BEP20' },
        { label: 'Tether USD (TRC20)', value: 'USDT.TRC20' },
        { label: 'Tether USD (ERC20)', value: 'USDT.ERC20' },
      ];
  
      const createTransaction = async () => {
        loading.value = true;
        try {
          const response = await fetch('http://localhost:2000/create-transaction', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: amount.value,
              currency: currency.value,
              userId: authStore.user.id,
              email: email.value,
            }),
          });
  
          const data = await response.json();
  
          if (data.success) {
            transactionDetails.value = data.transaction;
            showTransactionDetails.value = true;
          } else {
            throw new Error(data.error || 'Transaction creation failed');
          }
        } catch (error) {
          console.error('Error creating transaction:', error);
          $q.notify({
            color: 'negative',
            message: error.message || 'Error creating transaction. Please try again.',
            icon: 'report_problem',
            position: 'top-right',
          });
        } finally {
          loading.value = false;
        }
      };
  
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:2000/user/${authStore.user.id}`);
          const result = await response.json();
  
          if (result.success) {
            email.value = result.data.email;
  
            if (!email.value) {
              showEmailWarning.value = true;
            }
          } else {
            $q.notify({
              message: 'Failed to fetch user data',
              color: 'negative',
              position: 'top-right',
              timeout: 1500,
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          $q.notify({
            message: 'Error fetching user data',
            color: 'negative',
            position: 'top-right',
            timeout: 1500,
          });
        }
      };
  
      const goBack = () => {
        router.go(-1); // Navigate back to the previous page
      };
  
      const redirectToAccount = () => {
        router.push('/account'); // Redirect to the account page
      };
  
      onMounted(() => {
        fetchUserData();
      });
  
      return {
        amount,
        currency,
        loading,
        currencyOptions,
        createTransaction,
        transactionDetails,
        showTransactionDetails,
        showEmailWarning, // Return showEmailWarning to use it in the template
        goBack,
        redirectToAccount, 
      };
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .deposit-form {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .transaction-details {
    min-width: 300px;
  }
  </style>
  
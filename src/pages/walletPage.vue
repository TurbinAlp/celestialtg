<template>
    <q-page class="bg-amber-1 full-height">
      <q-header class="bg-amber-4 text-brown-9">
        <q-toolbar>
          <q-btn flat round dense icon="arrow_back" @click="goBack" />
          <q-toolbar-title>TRC20-USDT</q-toolbar-title>
        </q-toolbar>
      </q-header>
  
      <div class="content q-pa-md">
        <div class="text-center q-mb-lg">
          <q-avatar size="50px">
            <img src="path_to_trc20_logo.png" alt="TRC20-USDT">
          </q-avatar>
        </div>
  
        <div class="bg-white rounded-borders q-pa-md text-center">
          <q-img
            src="path_to_qr_code.png"
            spinner-color="primary"
            style="height: 200px; max-width: 200px; margin: 0 auto;"
          />
        </div>
  
        <div class="text-center text-brown-9 q-mt-sm">Address</div>
  
        <q-card class="q-mt-sm bg-amber-2">
          <q-card-section class="row items-center no-wrap">
            <div class="col text-brown-9 ellipsis">TFpZKxHWZ2daYYPDBPHb4cKRjFakHBD</div>
            <q-btn flat round color="brown-9" icon="content_copy" @click="copyAddress" />
          </q-card-section>
        </q-card>
  
        <q-btn
          class="full-width q-mt-md"
          color="brown-5"
          text-color="white"
          label="Recharge completed"
          @click="rechargeCompleted"
        />
  
        <div class="q-mt-lg text-brown-9">
          <p>1. Copy the address above or scan the QR code and select Tron (TRC20) network to deposit USDT</p>
          <p>2. Please do not recharge other non-Tron/TRC20-USDT assets. The funds will arrive in your account in about 1 to 3 minutes.</p>
          <p>3. If it does not arrive for a long time, please refresh the page or contact customer service.</p>
        </div>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useQuasar } from 'quasar';
  import { useRouter } from 'vue-router';
  
  const $q = useQuasar();
  const router = useRouter();
  
  const walletAddress = ref('TFpZKxHWZ2daYYPDBPHb4cKRjFakHBD');
  
  const goBack = () => {
    router.back();
  };
  
  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress.value).then(() => {
      $q.notify({
        color: 'positive',
        message: 'Address copied to clipboard',
        position: 'top'
      });
    });
  };
  
  const rechargeCompleted = () => {
    $q.notify({
      color: 'positive',
      message: 'Recharge completed successfully',
      position: 'top'
    });
  };
  </script>
  
  <style scoped>
  .full-height {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .content {
    flex-grow: 1;
    overflow-y: auto;
  }
  
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>
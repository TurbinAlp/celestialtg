<template>
  <q-page class="bg-grey-2">
    <q-header class="bg-white text-black">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" @click="goBack" />
        <q-toolbar-title>Personal Info</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-lg">
        <q-avatar size="100px" class="cursor-pointer" @click="triggerUpload">
          <img :src="profilePicture">
          <q-file v-model="newProfilePicture" @update:model-value="onFileSelected" accept="image/*" style="display: none" />
        </q-avatar>
      </div>

      <q-list bordered separator>
        <q-item>
          <q-item-section>
            <q-item-label>ID</q-item-label>
            <q-item-label caption>{{ userId }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round dense icon="content_copy" @click="copyId" />
          </q-item-section>
        </q-item>

        <q-item clickable @click="editNickname = true">
          <q-item-section>
            <q-item-label>Nickname</q-item-label>
            <q-item-label caption>{{ nickname }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>

        <q-item clickable @click="editEmail = true">
          <q-item-section>
            <q-item-label>Email</q-item-label>
            <q-item-label caption>{{ email }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
      </q-list>

      <div class="q-mt-lg">
        <q-btn color="primary" label="Save" @click="saveChanges" class="full-width" />
      </div>
    </div>

    <q-dialog v-model="editNickname">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Edit Nickname</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="newNickname" autofocus @keyup.enter="updateNickname" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Update" @click="updateNickname" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editEmail">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Edit Email</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="newEmail" autofocus @keyup.enter="updateEmail" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Update" @click="updateEmail" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const userId = ref('');
const nickname = ref('');
const email = ref('');
const profilePicture = ref('path_to_default_profile_picture.jpg');
const newProfilePicture = ref(null);
const editNickname = ref(false);
const newNickname = ref('');
const editEmail = ref(false);
const newEmail = ref('');

const goBack = () => {
  router.back();
};

const copyId = () => {
  navigator.clipboard.writeText(userId.value).then(() => {
    $q.notify({
      color: 'positive',
      message: 'ID copied to clipboard',
      position: 'top-right'
    });
  });
};

const triggerUpload = () => {
  document.querySelector('input[type="file"]').click();
};

const onFileSelected = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePicture.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const updateNickname = () => {
  if (newNickname.value.trim()) {
    nickname.value = newNickname.value.trim();
    newNickname.value = '';
  }
};

const updateEmail = async () => {
  if (newEmail.value.trim() && newEmail.value !== email.value) {
    email.value = newEmail.value.trim();
  } else {
    $q.notify({
      color: 'negative',
      message: 'Invalid email or no changes detected',
      position: 'top-right'
    });
  }
};

const saveChanges = async () => {
  try {
    const formData = new FormData();
    formData.append('nickname', nickname.value);
    formData.append('email', email.value);
    formData.append('profilePicture', newProfilePicture.value);

    const response = await fetch(`http://localhost:2000/user/update/${userId.value}`, {
      method: 'PUT',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      $q.notify({
        color: 'positive',
        message: 'Changes saved successfully',
        position: 'top-right'
      });
    } else {
      $q.notify({
        color: 'negative',
        message: 'Failed to save changes',
        position: 'top-right'
      });
    }
  } catch (error) {
    console.error('Error saving changes:', error);
    $q.notify({
      color: 'negative',
      message: 'Error saving changes',
      position: 'top-right'
    });
  }
};

const fetchUserData = async () => {
  try {
    const response = await fetch(`http://localhost:2000/user/${authStore.user.id}`);
    const result = await response.json();
    userId.value = result.data.id
    nickname.value = result.data.userName
    email.value = result.data.email
    profilePicture.value = result.data.profile_picture
    if (result.success) {
      // Update the Pinia store with the fetched data
      // authStore.setUser(result.data, authStore.token, false);
    } else {
      $q.notify({
        message: 'Failed to fetch user data',
        color: 'negative',
        position: 'top-right',
        timeout: 1500
      });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    $q.notify({
      message: 'Error fetching user data',
      color: 'negative',
      position: 'top-right',
      timeout: 1500
    });
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.deposit-form {
  max-width: 400px;
  margin: 0 auto;
}

.transaction-details {
  min-width: 300px;
}
</style>

<template>
    <q-page class="country-select-page q-pa-md">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat round dense icon="arrow_back" @click="goBack" />
                <q-toolbar-title>Select Country/Region</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <!-- Loading spinner -->
        <q-dialog v-model="isLoading" persistent>
            <q-spinner-dots color="primary" size="100px" /> <!-- Animated spinner -->
        </q-dialog>

        <q-input v-model="search" outlined dense placeholder="Please enter country/region" class="q-my-md">
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
        </q-input>

        <q-list separator>
            <q-item v-for="country in filteredCountries" :key="country.code" clickable @click="selectCountry(country)">
                <q-item-section avatar>
                    <q-avatar size="24px">
                        <img :src="`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`" :alt="country.name">
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    <q-item-label>{{ country.name }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label caption>{{ country.dialCode }}</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const search = ref('');
const countries = ref([]);
const isLoading = ref(true);


const fetchCountryCodes = async () => {
    try {
        isLoading.value = true; // Show spinner
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();

        countries.value = data.map(country => ({
            name: country.name?.common || 'Unknown',
            code: country.cca2 || 'Unknown',
            dialCode: (country.idd?.root || '') + (country.idd?.suffixes?.[0] || '') // Safely access idd and suffixes
        }));
    } catch (error) {
        console.error('Error fetching country codes:', error);
    } finally {
        isLoading.value = false; // Hide spinner
    }
};

onMounted(() => {
    fetchCountryCodes();
});

const filteredCountries = computed(() => {
    if (!search.value) return countries.value;
    const searchLower = search.value.toLowerCase();
    return countries.value.filter(country =>
        country.name.toLowerCase().includes(searchLower) ||
        country.dialCode.includes(searchLower)
    );
});

const goBack = () => {
    router.back();
};

const selectCountry = (country) => {
    const fromPage = router.currentRoute.value.query.from || 'login'; // Default to 'login' if 'from' is not set
    router.push({ name: fromPage, query: { countryCode: country.dialCode } });
};


</script>

<style scoped>
.country-select-page {
    background-color: white;
}

.q-toolbar {
    min-height: 50px;
}

.q-item {
    min-height: 48px;
}
</style>
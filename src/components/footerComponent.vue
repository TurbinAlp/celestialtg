<template>
    <q-footer elevated class="bg-grey-10">
        <q-tabs no-caps class="text-grey-7">
            <q-tab v-for="tab in bottomTabs" :key="tab.name" :name="tab.name" :icon="tab.icon" :label="tab.label"
                @click="navigateTo(tab.name)" :class="{ 'text-primary': isActiveTab(tab.name) }" />
        </q-tabs>
    </q-footer>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { reactive } from 'vue';

const router = useRouter();
const route = useRoute();

const bottomTabs = reactive([
    { name: 'home', icon: 'home', label: 'Home' },
    { name: 'markets', icon: 'show_chart', label: 'Markets' },
    { name: 'trade', icon: 'currency_exchange', label: 'Trade' },
    { name: 'news', icon: 'article', label: 'News' },
    { name: 'mine', icon: 'person', label: 'Mine' }
]);

const navigateTo = (tabName) => {
    if (tabName === 'home') router.push('/');
    else if (tabName === 'markets') router.push('/market');
    else if (tabName === 'trade') router.push('/currentPosition');
    else if (tabName === 'news') router.push('/news');
    else if (tabName === 'mine') router.push('/profile');
};

const isActiveTab = (tabName) => {
    if (tabName === 'home' && route.path === '/') return true;
    if (tabName === 'markets' && route.path === '/market') return true;
    if (tabName === 'trade' && route.path === '/currentPosition') return true;
    if (tabName === 'news' && route.path === '/news') return true;
    if (tabName === 'mine' && route.path === '/profile') return true;
    return false;
};
</script>

<style scoped>
.q-tabs .q-tab.text-primary {
    color: var(--q-color-primary) !important;
}
</style>
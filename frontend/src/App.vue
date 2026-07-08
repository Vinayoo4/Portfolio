<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <h1 class="text-xl font-bold">DentProSuite</h1>
      <div class="flex gap-4 items-center">
        <div v-if="!isOnline" class="flex items-center text-yellow-300 text-sm font-bold mr-4">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          Offline
        </div>
        <div v-if="syncCount > 0" class="flex items-center text-blue-200 text-sm mr-4" title="Pending sync items">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          {{ syncCount }} pending
        </div>
        <div v-if="auth.user" class="flex gap-4 items-center">
          <span class="text-sm hidden sm:inline">{{ auth.user.name }} ({{ auth.user.role }})</span>
          <button @click="logout" class="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition-colors">Logout</button>
        </div>
      </div>
    </header>
    <main class="flex-grow p-4">
      <router-view />
    </main>
    <SyncStatus />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth.js';
import { getSyncQueue, syncQueue } from './services/offlineStorage.js';
import SyncStatus from './components/SyncStatus.vue';
import { isAppwriteEnabled, account } from './services/appwrite.js';

const auth = useAuthStore();
const router = useRouter();
const isOnline = ref(navigator.onLine);
const syncCount = ref(0);

const updateOnlineStatus = async () => {
  isOnline.value = navigator.onLine;
  if (navigator.onLine) {
    await syncQueue();
  }
  await updateSyncCount();
};

const updateSyncCount = async () => {
  try {
    const items = await getSyncQueue();
    syncCount.value = items.length;
  } catch {
    syncCount.value = 0;
  }
};

let syncInterval: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateSyncCount();
  syncInterval = setInterval(updateSyncCount, 10000);
  if (isAppwriteEnabled) {
    await account.get();
  }
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
  if (syncInterval) clearInterval(syncInterval);
});

const logout = () => {
  auth.logout();
  router.push('/login');
};
</script>

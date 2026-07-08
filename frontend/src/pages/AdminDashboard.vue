<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Admin Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-2">Revenue Overview</h2>
        <p class="text-gray-600 mb-2">Simulation data for testing purposes.</p>
        <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50" :disabled="revenueLoading" @click="fetchRevenue">
          {{ revenueLoading ? 'Loading...' : 'Load Revenue' }}
        </button>
        <div v-if="revenueError" class="mt-4 text-red-500 text-sm">{{ revenueError }}</div>
        <div v-if="revenue" class="mt-4">
          <p><strong>Total:</strong> ${{ revenue.totalRevenue }}</p>
          <p><strong>Completed Appointments:</strong> {{ revenue.appointmentsCompleted }}</p>
        </div>
        <div v-if="!revenue && !revenueLoading && !revenueError" class="mt-4 text-gray-400 text-sm">
          Click to load revenue data
        </div>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-2">Form Templates</h2>
        <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" @click="showBuilder = true">Create New Template</button>
        <div v-if="forms.isLoading" class="mt-4 text-gray-500">Loading templates...</div>
        <ul v-else class="mt-4 space-y-2">
          <li v-for="t in forms.templates" :key="t.id" class="border p-2 rounded">
            {{ t.title }} ({{ t.isActive ? 'Active' : 'Draft' }})
          </li>
          <li v-if="forms.templates.length === 0" class="text-gray-400 text-sm">No templates yet.</li>
        </ul>
      </div>
    </div>
    <div v-if="showBuilder" class="mt-6 border-t pt-4">
      <FormBuilder @close="showBuilder = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useFormStore } from '../stores/forms.js';
import FormBuilder from '../components/FormBuilder.vue';
import { apiClient } from '../services/api.js';
import { cacheData, getCachedData } from '../services/offlineStorage.js';

const forms = useFormStore();
const revenue = ref<any>(null);
const revenueLoading = ref(false);
const revenueError = ref('');
const showBuilder = ref(false);

const fetchRevenue = async () => {
  revenueLoading.value = true;
  revenueError.value = '';
  try {
    const res = await apiClient.get('/api/billing/overview?startDate=2023-01-01&endDate=2099-12-31');
    revenue.value = res.data;
    await cacheData('admin_revenue', revenue.value);
  } catch {
    const cached = await getCachedData('admin_revenue');
    if (cached) {
      revenue.value = cached;
    } else {
      revenueError.value = 'Network error';
    }
  } finally {
    revenueLoading.value = false;
  }
};

onMounted(() => {
  forms.fetchTemplates();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Dentist Dashboard</h1>
    <p class="mb-4 text-gray-600">Welcome, {{ auth.user?.name }}. Here is your schedule for today.</p>

    <div class="flex gap-2 mb-4">
      <input type="date" v-model="filterDate" class="border p-2 rounded" />
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" @click="loadSchedule">Refresh Schedule</button>
    </div>

    <div v-if="appointments.isLoading" class="text-gray-500 py-4">Loading appointments...</div>
    <div v-else-if="appointments.error" class="text-red-500 py-4">{{ appointments.error }}</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AppointmentCard
        v-for="a in appointments.appointments"
        :key="a.id"
        :appointment="a"
        @status-changed="onStatusChanged"
      />
      <div v-if="appointments.appointments.length === 0" class="text-gray-400 col-span-full">
        No appointments scheduled for this date.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { useAppointmentStore } from '../stores/appointments.js';
import AppointmentCard from '../components/AppointmentCard.vue';

const auth = useAuthStore();
const appointments = useAppointmentStore();
const filterDate = ref(new Date().toISOString().split('T')[0]);

const loadSchedule = () => {
  appointments.fetchAppointments(filterDate.value, auth.user?.id);
};

const onStatusChanged = async (id: string, status: string) => {
  await appointments.updateStatus(id, status);
  loadSchedule();
};

onMounted(() => {
  loadSchedule();
});
</script>

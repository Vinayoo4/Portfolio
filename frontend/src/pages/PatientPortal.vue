<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">Patient Portal</h1>
    <p class="mb-6 text-gray-600">Welcome, {{ auth.user?.name }}.</p>

    <div class="bg-white p-4 rounded shadow mb-6">
      <h2 class="text-xl font-semibold mb-2">My Upcoming Appointments</h2>
      <ul>
        <li v-for="a in appointments.appointments" :key="a.id" class="border-b py-2 flex justify-between">
          <div>
            <p class="font-bold">{{ a.date }}</p>
            <p class="text-sm text-gray-600">{{ a.startTime }} - {{ a.endTime }}</p>
          </div>
          <span class="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800 self-center">{{ a.status }}</span>
        </li>
        <li v-if="appointments.appointments.length === 0" class="text-gray-500 py-2">
          No upcoming appointments.
        </li>
      </ul>
    </div>

    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-2">Forms to Complete</h2>
      <ul class="space-y-2">
        <li v-for="t in forms.templates" :key="t.id" class="flex justify-between items-center border p-2 rounded">
          <span>{{ t.title }}</span>
          <router-link :to="`/forms/${t.id}`" class="bg-green-500 text-white px-3 py-1 rounded text-sm">
            Fill Out
          </router-link>
        </li>
        <li v-if="forms.templates.length === 0" class="text-gray-500">
          No forms available.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { useAppointmentStore } from '../stores/appointments.js';
import { useFormStore } from '../stores/forms.js';

const auth = useAuthStore();
const appointments = useAppointmentStore();
const forms = useFormStore();

onMounted(() => {
  // Filter by patientId if the user has one, or show all for PATIENT role
  const patientId = auth.user?.id;
  appointments.fetchAppointments(undefined, patientId);
  forms.fetchTemplates();
});
</script>

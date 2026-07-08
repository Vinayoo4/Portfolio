<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Reception Dashboard</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">Appointments</h2>
        <div class="flex gap-2 mb-4">
          <input type="date" v-model="filterDate" class="border p-2 rounded" />
          <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="loadAppointments">Refresh</button>
        </div>
        <ul>
          <li v-for="a in appointments.appointments" :key="a.id" class="border-b py-2 flex justify-between items-center">
            <div>
              <p class="font-bold">{{ a.startTime }} - {{ a.endTime }}</p>
              <p class="text-sm">Patient: {{ a.patientId }} | Status: {{ a.status }}</p>
            </div>
            <button class="bg-gray-200 px-2 py-1 text-sm rounded" @click="updateStatus(a.id, 'CHECKED_IN')">Check In</button>
          </li>
          <li v-if="appointments.appointments.length === 0" class="text-gray-500">No appointments found.</li>
        </ul>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">Book Appointment</h2>
        <ReceptionBooking @booked="loadAppointments" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAppointmentStore } from '../stores/appointments.js';
import ReceptionBooking from '../components/ReceptionBooking.vue';

const appointments = useAppointmentStore();
const filterDate = ref(new Date().toISOString().split('T')[0]);

const loadAppointments = () => {
  appointments.fetchAppointments(filterDate.value);
};

const updateStatus = async (id: string, status: string) => {
  await appointments.updateStatus(id, status);
  loadAppointments();
};

onMounted(() => {
  loadAppointments();
});
</script>

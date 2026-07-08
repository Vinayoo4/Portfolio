<template>
  <form @submit.prevent="bookAppointment" class="space-y-3">
    <div>
      <label class="block text-sm font-medium">Patient ID</label>
      <input v-model="form.patientId" class="border p-2 w-full rounded" required />
    </div>
    <div>
      <label class="block text-sm font-medium">Dentist ID</label>
      <input v-model="form.dentistId" class="border p-2 w-full rounded" required />
    </div>
    <div>
      <label class="block text-sm font-medium">Date</label>
      <input type="date" v-model="form.date" class="border p-2 w-full rounded" required />
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="block text-sm font-medium">Start Time</label>
        <input type="time" v-model="form.startTime" class="border p-2 w-full rounded" required />
      </div>
      <div>
        <label class="block text-sm font-medium">End Time</label>
        <input type="time" v-model="form.endTime" class="border p-2 w-full rounded" required />
      </div>
    </div>
    <button type="submit" class="w-full bg-green-500 text-white p-2 rounded">Book Appointment</button>
    <p v-if="message" class="text-sm mt-2" :class="isError ? 'text-red-500' : 'text-green-600'">{{ message }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAppointmentStore } from '../stores/appointments.js';

const emit = defineEmits(['booked']);
const appointmentsStore = useAppointmentStore();

const form = ref({
  patientId: '',
  dentistId: 'dentist-1',
  chairId: 1,
  date: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '10:00',
  status: 'SCHEDULED'
});

const message = ref('');
const isError = ref(false);

const bookAppointment = async () => {
  message.value = '';
  try {
    await appointmentsStore.createAppointment(form.value);
    message.value = 'Appointment booked successfully.';
    isError.value = false;
    emit('booked');
  } catch (error) {
    message.value = 'Failed to book appointment.';
    isError.value = true;
  }
};
</script>

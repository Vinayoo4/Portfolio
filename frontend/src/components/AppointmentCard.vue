<template>
  <div class="border rounded p-4 shadow-sm bg-white flex flex-col justify-between">
    <div>
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-bold text-lg">{{ appointment.startTime }} - {{ appointment.endTime }}</h3>
        <span class="text-xs px-2 py-1 rounded-full text-white" :class="statusColor">
          {{ appointment.status }}
        </span>
      </div>
      <p class="text-sm text-gray-700 mb-1"><strong>Patient ID:</strong> {{ appointment.patientId }}</p>
      <p class="text-sm text-gray-700"><strong>Chair:</strong> {{ appointment.chairId }}</p>
    </div>

    <div class="mt-4 pt-3 border-t">
      <label class="block text-sm font-medium mb-1">Update Status</label>
      <select v-model="currentStatus" @change="updateStatus" class="border p-1 text-sm w-full rounded">
        <option value="SCHEDULED">Scheduled</option>
        <option value="CHECKED_IN">Checked In</option>
        <option value="IN_CHAIR">In Chair</option>
        <option value="COMPLETED">Completed</option>
        <option value="NO_SHOW">No Show</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['status-changed']);
const currentStatus = ref(props.appointment.status);

const statusColor = computed(() => {
  const map: Record<string, string> = {
    SCHEDULED: 'bg-gray-400',
    CHECKED_IN: 'bg-blue-500',
    IN_CHAIR: 'bg-yellow-500',
    COMPLETED: 'bg-green-500',
    NO_SHOW: 'bg-red-500'
  };
  return map[props.appointment.status] || 'bg-gray-400';
});

const updateStatus = async () => {
  emit('status-changed', props.appointment.id, currentStatus.value);
};
</script>

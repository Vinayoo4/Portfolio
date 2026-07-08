<template>
  <div class="bg-gray-100 p-4 rounded border">
    <h3 class="text-lg font-bold mb-2">Form Builder</h3>
    <form @submit.prevent="saveTemplate">
      <div class="mb-2">
        <label class="block">Title</label>
        <input v-model="template.title" class="border p-1 w-full" required />
      </div>
      <div class="mb-2">
        <label class="block">Description</label>
        <textarea v-model="template.description" class="border p-1 w-full"></textarea>
      </div>

      <div class="mb-4">
        <h4 class="font-semibold">Fields</h4>
        <div v-for="(field, index) in template.fields" :key="index" class="flex gap-2 mb-2 items-center">
          <input v-model="field.label" placeholder="Field Label" class="border p-1" required />
          <select v-model="field.type" class="border p-1">
            <option value="text">Text</option>
            <option value="checkbox">Checkbox</option>
            <option value="date">Date</option>
            <option value="signature">Signature</option>
          </select>
          <label><input type="checkbox" v-model="field.required" /> Req</label>
          <button type="button" class="text-red-500" @click="template.fields.splice(index, 1)">X</button>
        </div>
        <button type="button" class="text-sm bg-gray-200 px-2 py-1 rounded" @click="addField">+ Add Field</button>
      </div>

      <div class="flex gap-2">
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        <button type="button" class="bg-gray-400 text-white px-4 py-2 rounded" @click="$emit('close')">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFormStore } from '../stores/forms.js';

const emit = defineEmits(['close']);
const forms = useFormStore();

const template = ref({
  title: '',
  description: '',
  isActive: true,
  fields: [] as any[]
});

const addField = () => {
  template.value.fields.push({ id: `f${Date.now()}`, type: 'text', label: '', required: false });
};

const saveTemplate = async () => {
  try {
    await forms.createTemplate(template.value);
    emit('close');
  } catch (error) {
    //
  }
};
</script>

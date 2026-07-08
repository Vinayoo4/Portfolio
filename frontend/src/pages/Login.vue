<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center">DentPro Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium">Email</label>
          <input type="email" v-model="email" class="w-full border p-2 rounded" required />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium">Password</label>
          <input type="password" v-model="password" class="w-full border p-2 rounded" required />
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      </form>
      <div class="mt-4 text-xs text-gray-500 text-center">
        Demo logins:<br/>
        admin@clinic.com<br/>
        reception@clinic.com<br/>
        dentist1@clinic.com<br/>
        (Password: password123)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  error.value = '';
  try {
    const data = await authStore.login(email.value, password.value);

    switch(data.user.role) {
      case 'ADMIN': router.push('/admin'); break;
      case 'RECEPTION': router.push('/reception'); break;
      case 'DENTIST': router.push('/dentist'); break;
      case 'PATIENT': router.push('/patient'); break;
      default: router.push('/');
    }
  } catch (err: any) {
    if (err.response?.status === 401) {
      error.value = 'Invalid credentials';
    } else {
      error.value = err.response?.data?.error || 'Network error';
    }
  }
};
</script>

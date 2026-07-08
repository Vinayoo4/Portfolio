import { defineStore } from 'pinia';
import type { User } from '../../../shared/types/index.js';
import { apiClient } from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as Omit<User, 'passwordHash'> | null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(email: string, password: string) {
      const res = await apiClient.post('/api/auth/login', { email, password });
      this.setAuth(res.data.user, res.data.token);
      return res.data;
    },
    setAuth(user: Omit<User, 'passwordHash'>, token: string) {
      this.user = user;
      this.token = token;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
    },
    async fetchMe() {
      try {
        const res = await apiClient.get('/api/auth/me');
        this.user = res.data.user;
      } catch {
        this.logout();
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  }
});

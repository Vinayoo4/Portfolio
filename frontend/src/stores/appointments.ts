import { defineStore } from 'pinia';
import type { Appointment } from '../../../shared/types/index.js';
import { DataService } from '../services/api';

const appointmentsService = new DataService('/api/appointments', 'appointments');

export const useAppointmentStore = defineStore('appointments', {
  state: () => ({
    appointments: [] as Appointment[],
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchAppointments(date?: string, dentistId?: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const params: any = {};
        if (date) params.date = date;
        if (dentistId) params.dentistId = dentistId;

        this.appointments = await appointmentsService.getAll(params);
      } catch (err: any) {
         this.error = err.message || 'Failed to fetch appointments';
      } finally {
        this.isLoading = false;
      }
    },

    async createAppointment(data: any) {
      return appointmentsService.create(data);
    },

    async updateStatus(id: string, status: string) {
       // Optimistic update
       const index = this.appointments.findIndex(a => a.id === id);
       if (index !== -1) {
           this.appointments[index].status = status as any;
       }

       try {
         await appointmentsService.update(id, { status });
       } catch (err) {
         console.warn('Update failed, optimistic state preserved or sync queued.', err);
       }
    }
  }
});

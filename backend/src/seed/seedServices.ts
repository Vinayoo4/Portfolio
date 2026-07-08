import { getDatabaseAdapter } from '../storage/DatabaseService.js';
import { Service } from '../../../shared/types/index.js';

export async function seedServices() {
  const dbServices = getDatabaseAdapter<Service>('services');

  const services: Service[] = [
    { id: 'svc-1', name: 'New Patient Exam', price: 150, durationMinutes: 30, isActive: true },
    { id: 'svc-2', name: 'Teeth Cleaning', price: 200, durationMinutes: 60, isActive: true },
    { id: 'svc-3', name: 'X-Ray (Full Set)', price: 120, durationMinutes: 20, isActive: true },
    { id: 'svc-4', name: 'Tooth Extraction', price: 300, durationMinutes: 45, isActive: true },
    { id: 'svc-5', name: 'Root Canal', price: 800, durationMinutes: 90, isActive: true },
    { id: 'svc-6', name: 'Crown', price: 1000, durationMinutes: 60, isActive: true },
    { id: 'svc-7', name: 'Fillings (per tooth)', price: 180, durationMinutes: 30, isActive: true },
    { id: 'svc-8', name: 'Teeth Whitening', price: 350, durationMinutes: 45, isActive: true },
  ];

  await Promise.all(services.map(s => dbServices.insert(s)));
  console.log('Seeded services.');
}

import { seedUsers } from './seedUsers.js';
import { seedPatients } from './seedPatients.js';
import { seedForms } from './seedForms.js';
import { seedAppointments } from './seedAppointments.js';
import { seedBilling } from './seedBilling.js';
import { seedServices } from './seedServices.js';

async function seed() {
  console.log('Seeding data...');

  await seedUsers();
  await seedPatients();
  await seedForms();
  await seedServices();
  await seedAppointments();
  await seedBilling();

  console.log('Seed data generated successfully.');
}

seed().catch(console.error);

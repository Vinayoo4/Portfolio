import { Router } from 'express';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointments.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createAppointmentSchema, updateAppointmentSchema } from '../../../shared/schemas/index.js';

const router = Router();

router.use(requireAuth);

router.get('/', getAppointments);
router.post('/', requireRoles(['ADMIN', 'RECEPTION']), validate(createAppointmentSchema), createAppointment);
router.put('/:id', requireRoles(['ADMIN', 'RECEPTION', 'DENTIST']), validate(updateAppointmentSchema), updateAppointment);
router.delete('/:id', requireRoles(['ADMIN', 'RECEPTION']), deleteAppointment);

export default router;

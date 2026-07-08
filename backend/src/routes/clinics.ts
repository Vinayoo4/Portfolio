import { Router } from 'express';
import { getClinics, getClinicById, createClinic, updateClinic, deleteClinic } from '../controllers/clinics.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getClinics);
router.get('/:id', getClinicById);
router.post('/', requireRoles(['ADMIN']), createClinic);
router.put('/:id', requireRoles(['ADMIN']), updateClinic);
router.delete('/:id', requireRoles(['ADMIN']), deleteClinic);

export default router;

import { Router } from 'express';
import { getServices, getServiceById, createService, updateService, deleteService } from '../controllers/services.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', requireRoles(['ADMIN']), createService);
router.put('/:id', requireRoles(['ADMIN']), updateService);
router.delete('/:id', requireRoles(['ADMIN']), deleteService);

export default router;

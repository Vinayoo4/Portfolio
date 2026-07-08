import { Router } from 'express';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate, getSubmissions, submitForm, deleteSubmission } from '../controllers/forms.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTemplateSchema, updateTemplateSchema, submitFormSchema } from '../../../shared/schemas/index.js';

const router = Router();

router.get('/templates', requireAuth, getTemplates);
router.post('/templates', requireAuth, requireRoles(['ADMIN']), validate(createTemplateSchema), createTemplate);
router.put('/templates/:id', requireAuth, requireRoles(['ADMIN']), validate(updateTemplateSchema), updateTemplate);
router.delete('/templates/:id', requireAuth, requireRoles(['ADMIN']), deleteTemplate);

router.get('/submissions', requireAuth, getSubmissions);
router.post('/submissions', requireAuth, requireRoles(['ADMIN', 'RECEPTION', 'DENTIST', 'PATIENT']), validate(submitFormSchema), submitForm);
router.delete('/submissions/:id', requireAuth, requireRoles(['ADMIN']), deleteSubmission);

export default router;

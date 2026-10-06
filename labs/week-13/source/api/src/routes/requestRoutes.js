import { Router } from 'express';
import * as controller from '../controllers/requestController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', controller.listRequests);
router.post('/', validateRequest, controller.createRequest);
router.get('/:id', controller.getRequest);

router.put('/:id', authenticate, requireRole('staff'), controller.updateRequestStatus);
router.delete('/:id', authenticate, requireRole('staff'), controller.deleteRequest);

export default router;
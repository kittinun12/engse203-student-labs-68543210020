import { Router } from 'express';
import * as controller from '../controllers/requestController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

// Routes สำหรับ Path หลัก (/)
router.get('/', controller.listRequests);
router.post('/', validateRequest, controller.createRequest);

// Routes สำหรับ Path ที่มี Parameter (/:id)
router.get('/:id', controller.getRequest);
router.put('/:id', controller.updateRequestStatus);
router.delete('/:id', controller.deleteRequest);

export default router;
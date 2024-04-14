import { Router } from 'express';
import { UserController } from '../controllers/users.controller.js';

const router = Router();

router.put('/premium/:uid', UserController.changeRole);
router.post('/:uid/documents', UserController.addDocuments);

export default router;
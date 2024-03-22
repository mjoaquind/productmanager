import { Router } from 'express';
import { SessionController } from '../controllers/sessions.controller.js';

const router = Router();

router.put('/premium/:uid', SessionController.changeRole);

export default router;
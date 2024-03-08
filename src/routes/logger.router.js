import { Router } from 'express';
import { LoggersController } from '../controllers/loggers.controller.js';

const router = Router();

router.get('/', LoggersController.testLoggers);

export default router;
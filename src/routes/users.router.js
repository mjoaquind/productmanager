import { Router } from 'express';
import { UserController } from '../controllers/users.controller.js';
import uploader from '../utils/multer.js';

const router = Router();

router.put('/premium/:uid', UserController.changeRole);
router.post('/:uid/documents',uploader.fields([
    { name: 'identity'},
    { name: 'address'},
    { name: 'account'},
    { name: 'products'},
    { name: 'profile'}
]), UserController.addDocuments);

export default router;
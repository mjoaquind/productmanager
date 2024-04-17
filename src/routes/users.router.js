import { Router } from 'express';
import { UserController } from '../controllers/users.controller.js';
import uploader from '../utils/multer.js';

const router = Router();

router.put('/premium/:uid', UserController.changeRole);
router.post('/:uid/documents', uploader.fields([
    { name: 'identity'},
    { name: 'address'},
    { name: 'account'},
    { name: 'products'},
    { name: 'profile'}
]), async (req, res) => {
    try {
        res.send(await UserController.addDocuments(req, res));
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
}, UserController.addDocuments);

export default router;
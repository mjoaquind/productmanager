import { Router } from 'express';
import { checkRole } from '../middlewares/auth.js';
import { ProductController } from '../controllers/products.controller.js';
import uploader from '../utils/multer.js';

const router = Router();

router.get('/', ProductController.getProducts);

router.get('/:pid', ProductController.getProductById);

router.post('/', uploader.any(), checkRole(['admin', 'premium']), ProductController.addProduct);

router.put('/:pid', uploader.any(), checkRole(['admin', 'premium']), ProductController.updateProduct);

router.delete('/:pid', checkRole(['admin', 'premium']), ProductController.deleteProduct);

export default router;
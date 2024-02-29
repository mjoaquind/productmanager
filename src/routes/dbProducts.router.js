import { Router } from 'express';
import { checkRole } from '../middlewares/auth.js';
import { ProductController } from '../controllers/products.controller.js';

const router = Router();

router.get('/', ProductController.getProducts);

router.get('/:pid', ProductController.getProductById);

router.post('/',ProductController.addProduct);

router.put('/:pid', checkRole('admin'), ProductController.updateProduct);

router.delete('/:pid', checkRole('admin'), ProductController.deleteProduct);

export default router;
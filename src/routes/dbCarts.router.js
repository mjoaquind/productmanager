import { Router } from 'express';
import { checkRole } from '../middlewares/auth.js';
import { CartController } from '../controllers/carts.controller.js';

const router = Router();

router.get('/', CartController.getCarts);

router.get('/:cid', CartController.getCartById);

router.post('/', CartController.createCart);

router.post('/:cid/products/:pid', checkRole('user'), CartController.addProductToCart);

router.put('/:cid/products/:pid', CartController.updateProductQuantity);

router.put('/:cid', CartController.updateCart)

router.delete('/:cid', CartController.deleteCart);

router.delete('/:cid/products/:pid', CartController.deleteProductFromCart);

router.post('/:cid/purchase', CartController.purchaseCart);

export default router;
import { Router } from 'express';
import { CartController } from '../controllers/carts.controller.js';

const router = Router();

router.get('/', CartController.getCarts);

router.get('/:cid', CartController.getCartById);

router.post('/', CartController.createCart);

router.post('/:cid/products/:pid', CartController.addProductToCart);

router.put('/:cid/products/:pid', CartController.updateProductQuantity);

router.put('/:cid', CartController.updateCart)

router.delete('/:cid', CartController.deleteCart);

router.delete('/:cid/products/:pid', CartController.deleteProductFromCart);

//router.get('/cid/purschase', CartController.purchaseCart);

export default router;
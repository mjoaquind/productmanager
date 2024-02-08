import { Router } from "express";
import { FileCartController } from "../controllers/fileCarts.controller.js";

const router = Router();

router.get('/', FileCartController.getCarts);

router.get('/:cid', FileCartController.getCartById);

router.post('/', FileCartController.addCart);

router.post('/:cid/product/:pid', FileCartController.addProductToCart);

router.put('/:cid', FileCartController.updateCart);

router.delete('/:cid', FileCartController.deleteCart);

export default router;
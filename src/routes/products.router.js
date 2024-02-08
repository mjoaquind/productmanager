import { Router } from "express";
import { FileProductController } from "../controllers/fileProducts.controller.js";

const router = Router();

router.get('/', FileProductController.getProducts);

router.get('/:pid', FileProductController.getProductById);

router.post('/', FileProductController.addProduct);

router.put('/:pid', FileProductController.updateProduct);

router.delete('/:pid', FileProductController.deleteProduct);

export default router;
import { Router } from 'express';
import productsModel from '../dao/models/products.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productsModel.find();
        res.send({products});
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

export default router;
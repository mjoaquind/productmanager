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

router.post('/', async (req, res) => {
    let {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
    } = req.body;

    if (!title || !description || !price || !category || !code || !stock) {
        throw new Error('Excepto "thumbnails", todos los campos del producto son obligatorios');
    }

    let result = await productsModel.create({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
    });

    res.send({ status: "success", payload: result });
})

export default router;
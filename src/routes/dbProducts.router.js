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

router.get('/:pid', async (req, res) => {
    const product = await productsModel.findOne({ _id: req.params.pid });
    res.send({product});
})

router.post('/', async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            thumbnail = [],
            code,
            stock,
            status = true,
            category
        } = req.body;

        if (!title || !description || !price || !category || !code || !stock) {
            return res.status(400).send({ status: "error", message: "All fields are required" });
        }

        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category
        }

        const result = await productsModel.create(product);
        res.send({result});
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.get('/insert', async (req, res) => {
    const result = await productsModel.insertMany(products)
    res.send({result});
})

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const {
        title,
        description,
        price,
        thumbnail = [],
        code,
        stock,
        status = true,
        category
    } = req.body;

    if (!title || !description || !price || !category || !code || !stock) {
        return res.status(400).send({ status: "error", message: "All fields are required" });
    }

    const product = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category
    }

    const result = await productsModel.updateOne({_id: id}, {$set: product});
    res.send({result});
})

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid;
    let result = await productsModel.deleteOne({_id: id});
    res.send({result});
})

export default router;
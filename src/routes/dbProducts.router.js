import { Router } from 'express';
//import productsModel from '../dao/models/products.model.js';
import ProductManager from '../dao/mongoManagers/ProductManager.js';

const router = Router();

const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const {limit, page, sort, category, price} = req.query;
        const options = {
            lean: true,
            limit: limit ?? 10,
            page: page ?? 1,
            sort: {price: sort === "asc" ? 1 : -1}
        }

        const products = await productManager.getProducts({}, options);

        const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products;

        res.status(200).send({ 
            status: "success",
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `http://localhost:8080/api/products?limit=${limit}&page=${prevPage}` : null,
            nextLink: hasNextPage ? `http://localhost:8080/api/products?limit=${limit}&page=${nextPage}` : null
        });
    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message
        });
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById({ _id: req.params.pid });
        res.send({product});
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
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

        const result = await productManager.addProduct(product);
        res.send({result});
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.get('/insert', async (req, res) => {
    try {
        const result = await productsModel.insertMany(products)
        res.send({result});
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.put('/:pid', async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        let result = await productsModel.deleteOne({_id: id});
        res.send({result});
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

export default router;
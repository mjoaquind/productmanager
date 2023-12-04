import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import __dirname from "../utils.js";

const router = Router();

const path = `${__dirname}/files/Products.json`;
const productManager = new ProductManager(path);

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 0;

        const products = await productManager.getProducts();
        
        if(limit == 0){
            res.send({products});
        } else {
            const resultado = products.slice(0,limit);
            res.send({products: resultado});
        }
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productManager.getProductById(parseInt(pid));
        res.send({product});
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const product = req.body.product;
        const products = await productManager.addProduct(product);
        res.send({
            status:"success",
            message: "Product created",
            productos: {products}
        })
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = req.body.product;
        const products = await productManager.updateProduct(parseInt(pid), product);
        res.send({
            status:"success",
            message: `Product ${pid} updated`,
            productos: {products}
        })
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productManager.deleteProduct(parseInt(pid));
        res.send({
            status:"success",
            message: `Product ${pid} deleted`,
            productos: {product}
        })
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

export default router;
import { Router } from "express";
import CartManager from "../dao/fileManagers/CartManager.js";
import __dirname from "../utils.js";

const router = Router();

const path = `${__dirname}/dao/fileManagers/files/Carts.json`;
const cartManager = new CartManager(path);

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
    
        res.send({
            status: "success",
            carritos: carts
        });
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartById(parseInt(cid));
        res.send({cart});
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.addCart();
        res.send({
            status:"success",
            message: "Cart created",
            carritos: {cart}
        })
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
        res.send({
            status:"success",
            message: `Product ${pid} added to Cart ${cid}`,
            carritos: {cart}
        })
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.put('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const data = req.body.cart;
        const cart = await cartManager.updateCart(parseInt(cid), data);
        res.send({
            status:"success",
            message: `Cart ${cid} updated`,
            carritos: {cart}
        })
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.deleteCart(parseInt(cid));
        res.send({
            status:"success",
            message: `Cart ${cid} deleted`,
            carritos: {cart}
        })
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

export default router;
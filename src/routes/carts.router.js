import { Router } from "express";
import CartManager from "../managers/CartManager.js";
import __dirname from "../utils.js";

const router = Router();

const path = `${__dirname}/files/Carts.json`;
const cartManager = new CartManager(path);

router.get('/', async (req, res) => {

    const carts = await cartManager.getCarts();
    
    res.send({
        status: "success",
        carritos: carts
    });
    
})

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    res.send({cart});
})

router.post('/', async (req, res) => {
    const cart = await cartManager.addCart();
    res.send({
        status:"success",
        message: "Cart created",
        carritos: {cart}
    })
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await cartManager.addProductToCart(cid, pid);
    res.send({
        status:"success",
        message: `Product ${pid} added to Cart ${cid}`,
        carritos: {cart}
    })
})

router.put('/:cid', async (req, res) => {
    const cid = req.params.cid;
    res.send({
        status:"success",
        message: `Cart ${cid} updated`
    })
})

router.delete('/:cid', async (req, res) => {
    const cid = req.params.cid;
    res.send({
        status:"success",
        message: `Cart ${cid} deleted`
    })
})

export default router;
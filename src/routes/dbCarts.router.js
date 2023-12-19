import { Router } from 'express';
import cartsModel from '../dao/models/carts.model.js';
import CartManager from '../dao/mongoManagers/CartManager.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await cartsModel.find();
    
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
        const cart = await cartsModel.findOne({ _id: cid });
        res.send({cart});
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const cart = await cartsModel.create({});
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
        const cartManager = new CartManager();
        const cid = req.params.cid;
        const pid = req.params.pid;
        
        console.log(cid, pid);

        const cart = await cartManager.addProductToCart(cid, pid);
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
        const cart = await cartsModel.updateOne({ _id: cid }, data);
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
        const cart = await cartsModel.deleteOne({ _id: cid });
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
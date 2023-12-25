import { Router } from 'express';
import CartManager from '../dao/mongoManagers/CartManager.js';

const router = Router();

const cartManager = new CartManager();

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.createCart();
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

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity || 1;
        
        const cart = await cartManager.addProductToCart(cid, pid, quantity);
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

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const result = await cartsModel.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } });

        if (!result) {
            return res.status(404).json({ message: `Product ${pid} not found in cart ${cid}` });
        }

        const updatedCart = await cartsModel.findById(cid);

        res.send({
            status: "success",
            message: `Product ${pid} deleted from cart ${cid}`,
            carrito: updatedCart
        });
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
});

export default router;
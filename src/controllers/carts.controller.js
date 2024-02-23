import { cartService, productService, ticketService } from "../repository/index.js";
import { v4 as uuidv4 } from 'uuid';

class CartController {
    static getCarts = async (req, res) => {
        try {
            const carts = await cartService.getCarts();
            res.send({
                status: "success",
                carritos: carts
            });
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static getCartById = async (req, res) => {
        try {
            const cid = req.params.cid;
            const cart = await cartService.getCartById(cid);
            res.status(200).send({cart});
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static createCart = async (req, res) => {
        try {
            const cart = await cartService.createCart();
            res.send({
                status:"success",
                message: "Cart created",
                carritos: {cart}
            })
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static addProductToCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const quantity = req.body.quantity || 1;
            
            const cart = await cartService.addProductToCart(cid, pid, quantity);
            res.send({
                status:"success",
                message: `Product ${pid} added to Cart ${cid}`,
                carritos: {cart}
            })
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const quantity = req.body.quantity || 1;
    
            const cart = await cartService.updateProductQuantity(cid, pid, quantity);
            res.send({
                status:"success",
                message: `Product ${pid} added to Cart ${cid}`,
                carritos: {cart}
            })
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static updateCart = async (req, res) => {
        try {
            const cid = req.params.cid;
            const data = req.body;
            const cart = await cartService.updateCart(cid, data);
            res.send({
                status:"success",
                message: `Cart ${cid} updated`,
                carritos: {cart}
            })
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static deleteCart = async (req, res) => {
        try {
            const cid = req.params.cid;
            const cart = await cartService.deleteCart(cid);
            //const cart = await cartsModel.deleteOne({ _id: cid });
            res.send({
                status:"success",
                message: `Cart ${cid} is empty`,
                carritos: {cart}
            })
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static deleteProductFromCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
    
            const result = await cartService.deleteProductFromCart(cid, pid);
    
            if (!result) {
                return res.status(404).json({ message: `Product ${pid} not found in cart ${cid}` });
            }
    
            const updatedCart = await cartService.getCartById(cid);
    
            res.send({
                status: "success",
                message: `Product ${pid} deleted from cart ${cid}`,
                carrito: updatedCart
            });
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static purchaseCart = async (req, res) => {
        try {
            const cid = req.params.cid;
            const cart = await cartService.getCartById(cid);
            if(cart){
                if(cart.products.length == 0){
                    return res.status(400).json({ message: `Cart ${cid} is empty` });
                }
                const ticketProducts = [];
                const rejectedProducts = [];
                let ticketAmount = 0;
                for(let i=0; i<cart.products.length; i++){
                    const cartProduct = cart.products[i];
                    const productDB = await productService.getProductById(cartProduct.product._id);
                    if(!productDB){
                        return res.status(404).json({ message: `Product ${cartProduct.product._id} not found` });
                    }
                    if(cartProduct.quantity <= productDB.stock){
                        productDB.stock = productDB.stock - cartProduct.quantity;
                        await cartService.deleteProductFromCart(cid, productDB._id);
                        await productService.updateProduct(productDB._id, productDB);
                        ticketAmount += productDB.price * cartProduct.quantity;
                        ticketProducts.push(cartProduct);
                    } else {
                        rejectedProducts.push(cartProduct);
                    }
                }
                console.log("ticketProducts: ", ticketProducts);
                console.log("rejectedProducts: ", rejectedProducts);
                const newTicket = {
                    code: uuidv4(),
                    timestamp: Date.now(),
                    products: ticketProducts,
                    amount: ticketAmount,
                    purchaser: 'email@email.com'
                }
                const ticketCreated = await ticketService.createTicket(newTicket);
                res.send(ticketCreated);
            } else {
                return res.status(404).json({ message: `Cart ${cid} not found` });
            }
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }
}

export { CartController };
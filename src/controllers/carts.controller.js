import { cartService, productService, ticketService } from "../repository/index.js";
import { v4 as uuidv4 } from 'uuid';

class CartController {
    static getCarts = async (req, res) => {
        try {
            const carts = await cartService.getCarts();
            req.logger.info(`List of carts obtained!`);
            res.send({
                status: "success",
                carts
            });
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static getCartById = async (req, res) => {
        try {
            const cid = req.params.cid;
            const cart = await cartService.getCartById(cid);
            if(cart) {
                req.logger.info(`Cart ${cid} obtained!`);
                res.status(200).send({cart});
            } else {
                req.logger.error(`Cart ${cid} not found!`);
                res.status(404).send({ status: "error", message: "Cart not found" });
            }
            
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static createCart = async (req, res) => {
        try {
            const cart = await cartService.createCart();
            req.logger.info(`Cart ${cart._id} created!`);
            res.send({
                status:"success",
                message: "Cart created",
                carritos: {cart}
            })
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static addProductToCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            if (req.user.role === 'premium') {
                const product = await productService.getProductById(pid);
                if (product.owner === req.user._id) {
                    return res.status(400).send({ status: "error", message: `You cannot add your own product to the cart` });
                } 
                
            }
            const quantity = req.body.quantity || 1;
            const cart = await cartService.addProductToCart(cid, pid, quantity);
            req.logger.info(`Product ${pid} added to Cart ${cid}`);
            res.send({
                status:"success",
                message: `Product ${pid} added to Cart ${cid}`,
                carritos: {cart}
            })
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const quantity = req.body.quantity || 1;
    
            const cart = await cartService.updateProductQuantity(cid, pid, quantity);
            req.logger.info(`Product ${pid} added to Cart ${cid}`);
            res.send({
                status:"success",
                message: `Product ${pid} added to Cart ${cid}`,
                carts: {cart}
            })
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static updateCart = async (req, res) => {
        try {
            const cid = req.params.cid;
            const data = req.body;
            const cart = await cartService.updateCart(cid, data);
            req.logger.info(`Cart ${cid} updated`);
            res.send({
                status:"success",
                message: `Cart ${cid} updated`,
                carritos: {cart}
            })
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static deleteCart = async (req, res) => {
        try {
            const cid = req.params.cid;
            const cart = await cartService.deleteCart(cid);
            //const cart = await cartsModel.deleteOne({ _id: cid });
            req.logger.info(`Cart ${cid} deleted`);
            res.send({
                status:"success",
                message: `Cart ${cid} is empty`,
                carritos: {cart}
            })
        } catch (error) {
            req.logger.error(error);
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
    
            req.logger.info(`Product ${pid} deleted from cart ${cid}`);
            res.send({
                status: "success",
                message: `Product ${pid} deleted from cart ${cid}`,
                carrito: updatedCart
            });
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static purchaseCart = async (req, res) => {
        try {
            const cid = req.params.cid;
            const cart = await cartService.getCartById(cid);
            if(cart){
                if(cart.products.length == 0){
                    req.logger.warning(`Cart ${cid} is empty`);
                    return res.status(400).json({ message: `Cart ${cid} is empty` });
                }
                const ticketProducts = [];
                const rejectedProducts = [];
                let ticketAmount = 0;
                for(let i=0; i<cart.products.length; i++){
                    const cartProduct = cart.products[i];
                    const productDB = await productService.getProductById(cartProduct.product._id);
                    if(!productDB){
                        req.logger.warning(`Product ${cartProduct.product._id} not found`);
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
                req.logger.info(`Cart ${cid} purchased`);
                res.send(ticketCreated);
            } else {
                req.logger.warning(`Cart ${cid} not found`);
                return res.status(404).json({ message: `Cart ${cid} not found` });
            }
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }
}

export { CartController };
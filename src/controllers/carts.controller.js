import CartManagerMongo from "../dao/mongoManagers/CartManager.js"


const cartManager = new CartManagerMongo();
class CartController {
    static getCarts = async (req, res) => {
        try {
            const carts = await cartManager.gerCarts();
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
            const cart = await cartManager.getCartById(cid);
            res.status(200).send({cart});
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static createCart = async (req, res) => {
        try {
            const cart = await cartManager.createCart();
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
            
            const cart = await cartManager.addProductToCart(cid, pid, quantity);
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
    
            const cart = await cartManager.updateProductQuantity(cid, pid, quantity);
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
            const cart = await cartManager.updateCart(cid, data);
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
            const cart = await cartManager.deleteCart(cid);
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
    
            const result = await cartManager.deleteProductFromCart(cid, pid);
    
            if (!result) {
                return res.status(404).json({ message: `Product ${pid} not found in cart ${cid}` });
            }
    
            const updatedCart = await cartManager.getCartById(cid);
    
            res.send({
                status: "success",
                message: `Product ${pid} deleted from cart ${cid}`,
                carrito: updatedCart
            });
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }
}

export { CartController };
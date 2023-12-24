import cartsModel from '../models/carts.model.js';
import productsModel from '../models/products.model.js';

class CartManagerMongo {

    gerCarts = async () => {
        try {
            const carts = await cartsModel.find();
            return carts;
        } catch (error) {
            throw new Error(`Error al obtener los carritos: ${error.message}`);
        }
    }

    getCartById = async (id) => {
        try {
            const cart = await cartsModel.findOne({ _id: id });
            if (!cart) {
                throw new Error(`Carrito con ID ${id} no encontrado`);
            }
            return cart;
        } catch (error) {
            throw new Error(`Error al buscar el carrito: ${error.message}`);
        }
    }

    createCart = async () => {
        try {
            const cart = await cartsModel.create({});
            return cart;
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }

    addProductInCart = async (cid, pid, quantity = 1) => {
        try {
            const cart = await cartsModel.findOne({_id:cid});
            if (!cart) {
                throw new Error(`Carrito con ID ${cid} no encontrado`);
            }
            const product = await productsModel.findById({_id:pid});
            if (!product) {
                throw new Error(`Producto con ID ${pid} no encontrado`);
            }
            const existingProduct = cart.products.find(p => p.product.equals(pid));
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }
            await cart.save();
            return {
                status: 'success',
                message: `Se agrego el producto con el ID: ${pid} en el carrito con el ID: ${cid}`,
                carrito: cart
            }
        } catch (error) {
            throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
        }
    }
/*
    addProductToCart = async (cartId, productId) => {
        try {
            const cart = await cartsModel.findById(cartId);

            if(!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado`);
            }

            const product = await productsModel.findOne({ _id: productId });
            if(!product) {
                throw new Error(`Producto con ID ${productId} no encontrado`);
            }

            // Verificar si el producto ya está en el carrito
            const existingProduct = cart.products.find(p => p.product.equals(productId));

            if (existingProduct) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                existingProduct.quantity += 1;
            } else {
                // Si el producto no está en el carrito, agregarlo con cantidad 1
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cartsModel.updateOne({ _id: cartId }, cart);
            let resultado = `Se agrego el producto con el ID: ${productId} en el carrito con el ID: ${cartId}`;
            return resultado;
        } catch (error) {
            throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
        }
    }
*/
}

export default CartManagerMongo;
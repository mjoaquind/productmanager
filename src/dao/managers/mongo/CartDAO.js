import cartsModel from '../../models/carts.model.js';
import productsModel from '../../models/products.model.js';

export class CartDAO {

    constructor() {
        this.carts = cartsModel;
        this.products = productsModel;
    }

    getCarts = async () => {
        try {
            const carts = await this.carts.find();
            return carts;
        } catch (error) {
            return error.message;
        }
    }

    getCartById = async (id) => {
        try {
            const cart = await this.carts.findOne({ _id: id }).lean();
            if (!cart) {
                return new Error(`Carrito con ID ${id} no encontrado`);
            }
            return cart;
        } catch (error) {
            return error.message;
        }
    }

    createCart = async () => {
        try {
            const cart = await this.carts.create({});
            return cart;
        } catch (error) {
            return error;
        }
    }

    addProductToCart = async (cid, pid, quantity = 1) => {
        try {
            const cart = await this.carts.findOne({_id:cid});
            if (!cart) {
                return new Error(`Carrito con ID ${cid} no encontrado`);
            }
            const product = await this.products.findById({_id:pid});
            if (!product) {
                return new Error(`Producto con ID ${pid} no encontrado`);
            }
            const existingProduct = cart.products.find(p => p.product.equals(pid));
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }
            await cart.save();
            return cart;
        } catch (error) {
            return error.message;
        }
    }

    updateProductQuantity = async (cid, pid, quantity) => {
        try {
            const cart = await this.carts.findOne({ _id: cid });
            if (!cart) {
                return new Error(`Carrito con ID ${cid} no encontrado`);
            }
            const product = cart.products.find(p => p.product.equals(pid));
            if (!product) {
                return new Error(`Producto con ID ${pid} no encontrado en el carrito`);
            }
            product.quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            return error.message;
        }
    }

    updateCart = async (id, data) => {
        try {
            const cart = await this.carts.findById(id)
            cart.products = [];
            cart.products.push(data);
            await cart.save();
            if (!cart) {
                return new Error(`Carrito con ID ${id} no encontrado`);
            }
            return cart;
        } catch (error) {
            return error.message;
        }
    }

    deleteCart = async (id) => {
        try {
            const cart = await this.carts.findById(id);
            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            return error.message;
        }
    }

    deleteProductFromCart = async (cid, pid) => {
        try {
            const result = await this.carts.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } });
            return result;
        } catch (error) {
            return error.message;
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
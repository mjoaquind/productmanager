import fs from 'fs';
import ProductManager from './ProductManager.js';
import __dirname from "../../../dirname.js";

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
    }

    getCarts = async () => {
        if(fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const carts = JSON.parse(data);
            return carts;
        } else {
            return [];
        }
    }

    getCartById = async (id) => {
        try {
            const carts = await this.getCarts();
            const cartById = carts.find(cart => cart.id === id);
            if (!cartById) {
                throw new Error(`Carrito con ID ${id} no encontrado`);
            }
            return cartById;
        } catch (error) {
            throw new Error(`Error al buscar el carrito: ${error.message}`);
        }
    }

    getTotalQuantityInAllCarts = (carts, productId) => {
        return carts.reduce((total, cart) => {
            const productIndex = cart.products.findIndex(product => product.id === productId);
            if (productIndex !== -1) {
                total += cart.products[productIndex].quantity;
            }
            return total;
        }, 0);
    }

    addCart = async () => {
        try {
            const carts = await this.getCarts();

            const cart = {
                id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
                products: []
            };

            carts.push(cart);

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            let resultado = `Se agrego el carrito con el ID: ${cart.id}`;
            return resultado;
        } catch (error) {
            throw new Error(`Error al agregar el carrito: ${error.message}`);
        }
    }

    addProductToCart = async (cartId, productId) => {
        try {
            const carts = await this.getCarts();

            const cartIndex = carts.findIndex(cart => cart.id === cartId);

            if(cartIndex === -1) {
                throw new Error(`Carrito con ID ${cartId} no encontrado`);
            }

            const cart = carts[cartIndex];

            const productsPath = `${__dirname}/files/Products.json`;
            const producto = new ProductManager(productsPath);
            const product = await producto.getProductById(productId);
            if(product.id !== productId) {
                throw new Error(`Producto con ID ${productId} no encontrado`);
            }

            const totalQuantityInAllCarts = this.getTotalQuantityInAllCarts(carts, productId);

            if(totalQuantityInAllCarts >= product.stock) {
                throw new Error(`No hay suficiente stock del producto con ID ${productId}`);
            }

            const productIntex = cart.products.findIndex(product => product.id === productId);

            if(productIntex === -1) {
                cart.products.push({
                    id: productId,
                    quantity: 1
                });
            } else {
                if(cart.products[productIntex].quantity === product.stock) {
                    throw new Error(`No hay suficiente stock del producto con ID ${productId}`);
                } else {
                    cart.products[productIntex].quantity++;
                }
            }

            carts[cartIndex] = cart;
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            let resultado = `Se agrego el producto con el ID: ${productId} en el carrito con el ID: ${cartId}`;
            return resultado;
        } catch (error) {
            throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
        }
    }

    updateCart = async (cartId, updatedData) => {
        try {
            const carts = await this.getCarts();
            const index = carts.findIndex(cart => cart.id === cartId);
    
            if (index === -1) {
                throw new Error(`Carrito con ID ${cartId} no encontrado`);
            }
    
            for (const prod of updatedData.products) {
                const { id, quantity } = prod;

                if (!id || !quantity) {
                    throw new Error('Todos los campos del producto son obligatorios');
                }

                const productsPath = `${__dirname}/files/Products.json`;
                const producto = new ProductManager(productsPath);
                const product = await producto.getProductById(id);

                if (product.id !== id) {
                    throw new Error(`Producto con ID ${id} no encontrado`);
                }

                const totalQuantityInAllCarts = this.getTotalQuantityInAllCarts(carts, id);

                if (totalQuantityInAllCarts >= product.stock) {
                    throw new Error(`No hay suficiente stock del producto con ID ${id}`);
                }
            }

            const updatedCart = {
                ...carts[index],
                ...updatedData,
            };

            carts[index] = updatedCart;
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            let resultado = `Se actualizó el carrito con el ID: ${cartId}`;
            return resultado;
        } catch (error) {
            throw new Error(`Error al actualizar el carrito: ${error.message}`);
        }
    }

    deleteCart = async (id) => {
        try {
            const carts = await this.getCarts();
            const index = carts.findIndex(cart => cart.id === id);

            if (index === -1) {
                throw new Error(`Carrito con ID ${id} no encontrado`);
            }

            carts.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            let resultado = `Se eliminó el carrito con el ID: ${id}`;
            return resultado;
        } catch (error) {
            throw new Error(`Error al eliminar el carrito: ${error.message}`);
        }
    }
}

export default CartManager;
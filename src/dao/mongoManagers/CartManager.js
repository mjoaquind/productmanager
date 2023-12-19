import cartsModel from '../models/carts.model.js';
import productsModel from '../models/products.model.js';

class CartManagerMongo {
    

    addProductToCart = async (cartId, productId) => {
        try {
            const carts = await cartsModel.find();
            console.log(carts);
            const cartIndex = carts.findIndex(cart => cart.id === cartId);

            if(cartIndex === -1) {
                throw new Error(`Carrito con ID ${cartId} no encontrado`);
            }

            const cart = carts[cartIndex];

            const product = await productsModel.findOne({ _id: productId });
            if(!product) {
                throw new Error(`Producto con ID ${productId} no encontrado`);
            }

            const productIntex = cart.products.findIndex(product => product._id === productId);

            if(productIntex === -1) {
                cart.products.push({
                    _id: productId,
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
            await cartsModel.updateOne({ _id: cartId }, { $set: { products: cart.products } });
            let resultado = `Se agrego el producto con el ID: ${productId} en el carrito con el ID: ${cartId}`;
            return resultado;
        } catch (error) {
            throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
        }
    }
}

export default CartManagerMongo;
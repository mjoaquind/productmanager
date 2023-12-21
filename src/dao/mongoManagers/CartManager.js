import cartsModel from '../models/carts.model.js';
import productsModel from '../models/products.model.js';

class CartManagerMongo {

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
}

export default CartManagerMongo;
import productsModel from '../models/products.model.js';

class ProductManagerMongo {
    getProducts = async (options) => {
        const products = await productsModel.paginate(
            {
                // parar lo filtrado
            }, 
            options
        );
        return {
            status: "success",
            msg: products
        }
    }
}

    getProductById = async (pid) => {
        const product = await productsModel.findOne({ _id: pid });
        if (!product) {
            return {
                status: "error",
                msg: `Product ${pid} not found`
            }
        }
        return product;
    }

export default ProductManagerMongo;
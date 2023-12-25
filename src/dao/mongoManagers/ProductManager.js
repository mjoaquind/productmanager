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

    addProduct = async (product) => {
        let id = 0;
        const { title, description, price, status = true, category, thumbnail = [], code, stock } = product;
        try {
            const products = await this.getProducts();

            if (!title || !description || !price || !category || !code || !stock) {
                return {
                    status: "error", 
                    msg: 'Excepto "thumbnails", todos los campos del producto son obligatorios'
                }
            }

            if (products.some(product => product.code === code)) {
                return {
                    status: "error", 
                    msg: `El código de producto ${code} está duplicado.`
                }
            }

            const productData = {
                title,
                description,
                price,
                thumbnail: Array.isArray(thumbnail) ? thumbnail : [],
                code,
                stock,
                status,
                category,
            };

            products.push(productData);
            const resultado = await products.save();
            return resultado;
        } catch (error) {
            throw new Error(`Error al agregar el producto: ${error.message}`);
        }
    }

}
export default ProductManagerMongo;
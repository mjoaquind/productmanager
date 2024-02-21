import productsModel from '../../models/products.model.js';

export class ProductDAO {
    getProducts = async (filter, options) => {
        try {
            const products = await productsModel.paginate(filter, options);
            return products;
        } catch (error) {
            return error;
        }
    }

    getProductById = async (pid) => {
        const product = await productsModel.findOne({ _id: pid }).lean();
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
            const products = await productsModel.find();

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

            const result = await productsModel.create(productData);
            return result;
        } catch (error) {
            return error;
        }
    }


    updateProduct = async (pid, product) => {
        try {
            const result = await productsModel.updateOne({ _id: pid }, { $set: product });
            return result;
        } catch (error) {
            return error;
        }
    }

    deleteProduct = async (id) => {
        try {
            const result = await productsModel.deleteOne({ _id: id });
            return result;
        } catch (error) {
            return error;
        }
    }
}
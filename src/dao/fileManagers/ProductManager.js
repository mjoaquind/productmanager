import fs from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    getProducts = async () => {
        if(fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            return products;
        } else {
            return [];
        }
    }

    getProductById = async (id) => {
        try {
            const products = await this.getProducts();
            const productById = products.find(product => product.id === id);
            if (!productById) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
            return productById;
        } catch (error) {
            throw new Error(`Error al buscar el producto: ${error.message}`);
        }
    }

    addProduct = async (product) => {
        let id = 0;
        const { title, description, price, status = true, category, thumbnail = [], code, stock } = product;
        try {
            const products = await this.getProducts();

            if (products.length === 0) {
                id = 1;
            } else {
                id = products[products.length - 1].id + 1;
            }

            if (!title || !description || !price || !category || !code || !stock) {
                throw new Error('Excepto "thumbnails", todos los campos del producto son obligatorios');
            }

            if (products.some(product => product.code === code)) {
                throw new Error(`El código de producto ${code} está duplicado.`);
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
                id
            };

            products.push(productData);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            let resultado = `Se agregó el producto con el ID: ${productData.id}`;
            return resultado;
        } catch (error) {
            throw new Error(`Error al agregar el producto: ${error.message}`);
        }
    }

    updateProduct = async (id, updatedData) => {
        try {
            const { title, description, price, status = true, category, thumbnail = [], code, stock } = updatedData;
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === id);

            if (index === -1) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }

            if (!title || !description || !price || !category || !code || !stock) {
                throw new Error('Excepto "thumbnails", todos los campos del producto son obligatorios');
            }

            if (products.some(product => product.code === updatedData.code && product.id !== id)) {
                throw new Error("El código de producto está duplicado.");
            }

            const updatedProduct = {
                ...products[index],
                title,
                description,
                price,
                status,
                category,
                thumbnail: Array.isArray(thumbnail) ? thumbnail : [],
                code,
                stock,
            };

            products[index] = updatedProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            let resultado = `Se actualizó el producto con el ID: ${id}`;
            return resultado;
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

    deleteProduct = async (id) => {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === id);

            if (index === -1) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }

            products.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            let resultado = `Se eliminó el producto con el ID: ${id}`;
            return resultado;
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}

export default ProductManager;
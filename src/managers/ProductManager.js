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
            const productById = products.find(product => parseInt(product.id) === parseInt(id));
            
            if (!productById) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
            return productById;
        } catch (error) {
            let resultado = `Error al buscar el producto: ${error.message}`;
            return resultado;
        }
    }

    addProduct = async (productData) => {
        let resultado = '';
        try {
            const { title, description, price, thumbnail, code, stock } = productData;

            const products = await this.getProducts();

            if(products.length === 0) {
                productData.id = 1;
            } else {
                productData.id = products[products.length - 1].id + 1;
            }

            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error('Todos los campos del producto son obligatorios');
            }

            if (products.some(product => product.code === code)) {
                throw new Error(`El código de producto ${code} está duplicado.`);
            }
        
            products.push(productData);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            resultado = `Se agrego el producto con el ID: ${productData.id}`;
        } catch (error) {
            resultado = `Error al agregar el producto: ${error.message}`;
        }
        return resultado;
    }

    updateProduct = async (id, updatedData) => {
        let resultado = '';
        try {
            const { title, description, price, thumbnail, code, stock } = updatedData;
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === id);
            
            if (index === -1) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }

            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error('Todos los campos del producto son obligatorios');
            }

            if (products.some(product => product.code === updatedData.code && product.id !== id)) {
                throw new Error("El código de producto está duplicado.");
            }

            const updatedProduct = {
                ...products[index],
                ...updatedData,
            };

            products[index] = updatedProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            resultado = `Se actualizó el producto con el ID: ${id}`;
        } catch (error) {
            resultado = `Error al actualizar el producto: ${error.message}`;
        }
        return resultado;
    }

    deleteProduct = async (id) => {
        let resultado = '';
        try {
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === id);
            if (index === -1) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }

            products.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            resultado = `Se eliminó el producto con el ID: ${id}`;
        } catch (error) {
            resultado = `Error al eliminar el producto: ${error.message}`;
        }
        return resultado;
    }
}

export default ProductManager;
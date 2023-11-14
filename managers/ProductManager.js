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

    addProduct = async (productData) => {
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
            throw new Error("El código de producto está duplicado.");
        }
    
        products.push(productData);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        console.info(`Se agrego el producto con el ID: ${productData.id}`);
    }

    getProductById = async (id) => {
        const products = await this.getProducts();
        const productById = products.find(product => product.id === id);
        if (!productById) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }
        return productById;
    }


    updateProduct = async (id, updatedData) => {
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
        console.info(`Se actualizó el producto con el ID: ${id}`);
    }


    deleteProduct = async (id) => {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index === -1) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }

        products.splice(index, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        console.info(`Se eliminó el producto con el ID: ${id}`);
    }
}

export default ProductManager;
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

        await this.getProducts();

        if(this.products.length === 0) {
            productData.id = 1;
        } else {
            productData.id = this.products[this.products.length - 1].id + 1;
        }

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos del producto son obligatorios');
        }

        if (this.products.some(product => product.code === code)) {
            throw new Error("El código de producto está duplicado.");
        }
    
        const product = {
            id: productData.id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        this.products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
        console.info(`Se agrego el producto con el ID: ${productData.id}`);
    }

    getProductById = async(id) => {
        await this.getProducts();
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }
        return product;
    }


    updateProduct = async (id, updatedData) => {
        const { title, description, price, thumbnail, code, stock } = updatedData;
        await this.getProducts();
        const index = this.products.findIndex(product => product.id === id);
        
        if (index === -1) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos del producto son obligatorios');
        }

        if (this.products.some(product => product.code === updatedData.code && product.id !== id)) {
            throw new Error("El código de producto está duplicado.");
        }

        const updatedProduct = {
            ...this.products[index],
            ...updatedData,
        };

        this.products[index] = updatedProduct;
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
        console.info(`Se actualizó el producto con el ID: ${id}`);
    }


    deleteProduct = async (id) => {
        await this.getProducts();
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }

        this.products.splice(index, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
        console.info(`Se eliminó el producto con el ID: ${id}`);
    }
}

export default ProductManager;
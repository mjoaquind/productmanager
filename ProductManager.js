class ProductManager {
    constructor() {
        this.products = [];
    }

    generateProductId() {
        let id = this.products.length + 1;
        return id;
    }

    getProducts() {
        return this.products;
    }

    addProduct(productData) {
        const { title, description, price, thumbnail, code, stock } = productData;

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos del producto son obligatorios');
        }

        if (this.products.some(product => product.code === code)) {
            throw new Error("El código de producto está duplicado.");
        }
    
        const id = this.generateProductId();
        const product = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        this.products.push(product);
        console.info(`Se agrego el producto con el ID: ${id}`);
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }
        return product;
    }
}

const productManager = new ProductManager();
// Obtener productos (debe devolver un arreglo vacío)
console.log(productManager.getProducts());

// Agregar un producto
try {
    productManager.addProduct({
        title: "producto prueba",
        description: "Este es un producto prueba",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 25,
    });
} catch (error) {
    console.error(error.message);
}

try {
    productManager.addProduct({
        title: "producto prueba 2",
        description: "Este es un producto prueba 2",
        price: 400,
        thumbnail: "Tampoco tiene imagen",
        code: "abcd1234",
        stock: 5,
    });
} catch (error) {
    console.error(error.message);
}
// Obtener productos nuevamente (debe incluir el producto recién agregado)
console.log(productManager.getProducts());

// Intentar agregar un producto con el mismo código (debe arrojar un error)

try {
    productManager.addProduct({
        title: "producto prueba",
        description: "Este es un producto prueba",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 25,
    });
} catch (error) {
    console.error(error.message);
}

// Obtener un producto por ID (debe devolver el producto agregado)
try {
    console.log(productManager.getProductById(1))
} catch (error) {
    console.error(error.message);
}

try {
    console.log(productManager.getProductById(2))
} catch (error) {
    console.error(error.message);
}


// Intentar obtener un producto por un ID inexistente (debe devolver error)
try {
    console.log(productManager.getProductById(3))
} catch (error) {
    console.error(error.message);
}
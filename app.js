import ProductManager from "./managers/ProductManager.js";

const path = './files/Products.json';


const productManager = new ProductManager(path);
// Obtener productos (debe devolver un arreglo vacío)

const env = async () => {
    let products = await productManager.getProducts();
    console.log(products);

    // Agregar un producto
    const newProduct = await productManager.addProduct({
            title: "producto prueba",
            description: "Este es un producto prueba",
            price: 200,
            thumbnail: "Sin imagen",
            code: "abc123",
            stock: 25,
        });
    console.log(newProduct);

    // intento agregar un producto con codigo duplicado
    const newProduct2 = await productManager.addProduct({
            title: "producto prueba 2",
            description: "Este es un producto prueba 2",
            price: 400,
            thumbnail: "Tampoco tiene imagen",
            code: "abc123",
            stock: 5,
        });
    console.log(newProduct2);

    // inserto el 2do producto
    const newProduct3 = await productManager.addProduct({
            title: "producto prueba 2",
            description: "Este es un producto prueba 2",
            price: 400,
            thumbnail: "Tampoco tiene imagen",
            code: "abcd1234",
            stock: 5,
        });
    console.log(newProduct3);

    // actualizo el 2do producto
    const updateProduct1 = await productManager.updateProduct(2, {
            title: "actualizo el producto de prueba 2",
            description: "Este es un producto prueba 2 actualizado",
            price: 450,
            thumbnail: "Tampoco tiene imagen",
            code: "abcd1234",
            stock: 3,
        });
    console.log(updateProduct1);

    // muestro el producto con id 1
    console.log('muestro el producto con id 1:' + await productManager.getProductById(1))

    // muestro el producto con id 3 (que no existe)
    console.log('muestro el producto con id 3 (que no existe):' + await productManager.getProductById(3))

    // elimino el producto con id 1
    console.log('elimino el producto con id 1:' + await productManager.deleteProduct(1))
    
}

env();
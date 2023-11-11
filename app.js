import ProductManager from "./managers/ProductManager.js";

const path = './files/Products.json';


const productManager = new ProductManager(path);
// Obtener productos (debe devolver un arreglo vacío)

const env = async () => {
    let products = await productManager.getProducts();
    console.log(products);

    // Agregar un producto
    try {
        await productManager.addProduct({
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

    // intento agregar un producto con codigo duplicado
    try {
        await productManager.addProduct({
            title: "producto prueba 2",
            description: "Este es un producto prueba 2",
            price: 400,
            thumbnail: "Tampoco tiene imagen",
            code: "abc123",
            stock: 5,
        });
    } catch (error) {
        console.error(error.message);
    }

    // inserto el 2do producto
    try {
        await productManager.addProduct({
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

    // actualizo el 2do producto
    try {
        await productManager.updateProduct(2, {
            title: "actualizo el producto de prueba 2",
            description: "Este es un producto prueba 2 actualizado",
            price: 450,
            thumbnail: "Tampoco tiene imagen",
            code: "abcd1234",
            stock: 3,
        });
    } catch (error) {
        console.error(error.message);
    }

    // muestro el producto con id 1
    try {
        console.log(await productManager.getProductById(1))
    } catch (error) {
        console.error(error.message);
    }

    // muestro el producto con id 3 (que no existe)
    try {
        console.log(await productManager.getProductById(3))
    } catch (error) {
        console.error(error.message);
    }

    // elimino el producto con id 1
    try {
        console.log(await productManager.deleteProduct(1))
    } catch (error) {
        console.error(error.message);
    }
}

env();
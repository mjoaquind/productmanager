import express from "express";
import ProductManager from "./managers/ProductManager.js";

const PORT = 8080;

const app = express();

app.use(express.urlencoded({extended:true}));

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})

const path = './src/files/Products.json';
const productManager = new ProductManager(path);

app.get('/products', async (req, res) => {

    let limit = parseInt(req.query.limit) || 0;

    const products = await productManager.getProducts();
    
    if(limit == 0){
        res.json({products});
    } else {
        const resultado = products.slice(0,parseInt(limit));
        res.json({products: resultado});
    }
    
})

app.get('/products/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    res.json({product});
})

/*
const env = async () => {
    // pruebo agregar un producto con codigo que ya existe
    const newProduct = await productManager.addProduct({
        title: "Producto 10",
        description: "Este es el décimo producto de prueba",
        price: 190,
        thumbnail: "Imagen 10",
        code: "p10abc123",
        stock: 30
    });
    console.log(newProduct);
    // pruebo agregar un nuevo producto que no esta desde el inicio en Products.json
    const newProduct1 = await productManager.addProduct({
        title: "Producto 11",
        description: "Este es el onceavo producto de prueba",
        price: 310,
        thumbnail: "Imagen 11",
        code: "p11abc123",
        stock: 9
    });
    console.log(newProduct1);
}

env();
*/
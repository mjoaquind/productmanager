import express from "express";
import ProductManager from "./managers/ProductManager.js";

const PORT = 3000;

const app = express();

app.use(express.urlencoded({extended:true}));

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})

const path = './src/files/Products.json';
const productManager = new ProductManager(path);

app.get('/products', async (req, res) => {

    let limit = parseInt(req.query.limit) || 0;
    console.log(limit);

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

const env = async () => {
    const newProduct = await productManager.addProduct({
        title: "Producto 7",
        description: "Este es el séptimo producto de prueba",
        price: 200,
        thumbnail: "Imagen 7",
        code: "p7abc123",
        stock: 25
    });
    console.log(newProduct);
    const newProduct1 = await productManager.addProduct({
        title: "Producto 8",
        description: "Este es el octavo producto de prueba",
        price: 170,
        thumbnail: "Imagen 8",
        code: "p8abc123",
        stock: 14
    });
    console.log(newProduct1);
    const newProduct2 = await productManager.addProduct({
        title: "Producto 9",
        description: "Este es el noveno producto de prueba",
        price: 220,
        thumbnail: "Imagen 9",
        code: "p9abc123",
        stock: 22
    });
    console.log(newProduct2);
    const newProduct3 = await productManager.addProduct({
        title: "Producto 10",
        description: "Este es el décimo producto de prueba",
        price: 190,
        thumbnail: "Imagen 10",
        code: "p10abc123",
        stock: 30
    });
    console.log(newProduct3);
}

env();
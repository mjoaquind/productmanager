import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";
import __dirname from "./utils.js";
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const httpServer = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

const socketServer = new Server(httpServer);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));

// inicializo las rutas
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);
app.use('/',viewsRouter);


socketServer.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado con ID:",socket.id);
    const path = `${__dirname}/files/Products.json`;
    const productManager = new ProductManager(path);

    // Emite el evento 'products' a todos los clientes conectados
    try {
        const products = await productManager.getProducts();
        socketServer.emit('products', products);
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
    }

    socket.on('addProduct', async (product) => {
        try {
            await productManager.addProduct(product);
            const products = await productManager.getProducts();
            socketServer.emit('products', products);
            console.log('Producto agregado:', product);
        } catch (error) {
            console.error('Error al agregar el producto:', error.message);
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            await productManager.deleteProduct(id);
            const products = await productManager.getProducts();
            socketServer.emit('products', products);
            console.log('Producto eliminado:', id);
        } catch (error) {
            console.error('Error al eliminar el producto:', error.message);
        }
    });
});
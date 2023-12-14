import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./dao/fileManagers/ProductManager.js";

import dbProductsRouter from "./routes/dbProducts.router.js";

import __dirname from "./utils.js";
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from "mongoose";
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const httpServer = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

const socketServer = new Server(httpServer);

const MONGO = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.mongodb.net/ecommerce`;

const connection = mongoose.connect(MONGO);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));

// inicializo las rutas
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);
app.use('/',viewsRouter);
app.use('/products',dbProductsRouter);


socketServer.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado con ID:",socket.id);
    const path = `${__dirname}/dao/fileManagers/files/Products.json`;
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
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


socketServer.on("connection", (socket) => {
    console.log("Nuevo cliente conectado con ID:",socket.id);

    socket.on('addProduct', async (product) => {
        try {
            console.log('Datos del producto recibidos en el servidor:', product);

            const path = `${__dirname}/files/Products.json`;
            const productManager = new ProductManager(path);
            await productManager.addProduct(product);

            // Emite el evento 'newProduct' a todos los clientes conectados para actualizar la lista en tiempo real
            socketServer.emit('newProduct', product);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    });
});
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

const io = new Server(httpServer);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));

// inicializo las rutas
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);
app.use('/',viewsRouter);


const path = `${__dirname}/files/Products.json`;
const productManager = new ProductManager(path);


io.on('connection', async (socket) => {
    try {
        console.log('Nuevo cliente conectado');

        const products = await productManager.getProducts();
        io.to(socket.id).emit('realTimeProductsUpdate', { products });

        socket.on('addProduct', async (data) => {
        console.log('Mensaje recibido desde el cliente:', data);
        try {
            if (data === 'productChanged') {
            const products = await productManager.getProducts();
            io.emit('realTimeProductsUpdate', { products });
            }
        } catch (error) {
            console.error('Error al manejar el mensaje:', error.message);
        }
        });
    } catch (error) {
        console.error('Error en la conexión de socket:', error.message);
    }
});
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
//import productsRouter from "./routes/products.router.js";
//import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
//import ProductManager from "./dao/fileManagers/ProductManager.js";
import { ProductDAO } from "./dao/managers/mongo/ProductDAO.js";

//import productsModel from "./dao/models/products.model.js";
import messagesModel from "./dao/models/messages.model.js";

import dbProductsRouter from "./routes/dbProducts.router.js";
import dbCartsRouter from './routes/dbCarts.router.js';
import sessionRouter from './routes/sessions.router.js'

import passport from "passport";
import initializePassport from "./config/passport.config.js";

import __dirname from "./dirname.js";
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';

import { options } from './config/config.js';

let messages = [];

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = options.server.port || 8080;

const httpServer = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

const io = new Server(httpServer);

const MONGO = `mongodb+srv://${options.mongo.user}:${options.mongo.pass}@${options.mongo.cluster}.mongodb.net/ecommerce`;

app.use(express.static(`${__dirname}/public`));

app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl: 3600
    }),
    secret: 'CoderSecret',
    resave: false,
    saveUninitialized: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

// inicializo las rutas
//app.use('/api/products',productsRouter);
//app.use('/api/carts',cartsRouter);
app.use('/',viewsRouter);
app.use('/api/products',dbProductsRouter);
app.use('/api/carts',dbCartsRouter);
app.use('/api/session',sessionRouter);


io.on("connection", async (socket) => {
    //console.log("Nuevo cliente conectado con ID:",socket.id);
    //const path = `${__dirname}/dao/fileManagers/files/Products.json`;
    //const productManager = new ProductManager(path);
    const productDAO = new ProductDAO();

    // Emite el evento 'products' a todos los clientes conectados
    try {
        const products = await productDAO.getProducts();
        //const products = await productsModel.find();
        io.emit('products', products);
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
    }

    socket.on('addProduct', async (product) => {
        try {
            const result = await productDAO.addProduct(product);
            const products = await productDAO.getProducts();
            //await productsModel.create(product);
            //const products = await productsModel.find();
            io.emit('products', products);
            console.log('Producto agregado:', result);
        } catch (error) {
            console.error('Error al agregar el producto:', error.message);
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            await productDAO.deleteProduct(id);
            const products = await productDAO.getProducts();
            //await productsModel.deleteOne({ _id: id });
            //const products = await productsModel.find();
            io.emit('products', products);
            console.log('Producto eliminado:', id);
        } catch (error) {
            console.error('Error al eliminar el producto:', error.message);
        }
    });
});

io.on("connection", async (socket) => {

    io.emit("messages", await messagesModel.find());

    socket.on("chat-message", async (data) => {
        await messagesModel.create(data);
        io.emit("messages", await messagesModel.find());
    })

    socket.on("new-user", async (user) => {
        socket.emit("messages",await messagesModel.find());
        socket.broadcast.emit("new-user", user);
    })
})
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
//import productsRouter from "./routes/products.router.js";
//import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
//import ProductManager from "./dao/fileManagers/ProductManager.js";
import ProductManager from "./dao/mongoManagers/ProductManager.js";

//import productsModel from "./dao/models/products.model.js";
import messagesModel from "./dao/models/messages.model.js";

import dbProductsRouter from "./routes/dbProducts.router.js";
import dbCartsRouter from './routes/dbCarts.router.js';
import sessionRouter from './routes/sessions.router.js'

import passport from "passport";
import initializePassport from "./config/passport.config.js";

import __dirname from "./utils.js";
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from "mongoose";
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = 8080;

let messages = [];

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const httpServer = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

const io = new Server(httpServer);

const MONGO = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.mongodb.net/ecommerce`;

const connection = mongoose.connect(MONGO);

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
    const productManager = new ProductManager();

    // Emite el evento 'products' a todos los clientes conectados
    try {
        const products = await productManager.getProducts();
        //const products = await productsModel.find();
        io.emit('products', products);
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
    }

    socket.on('addProduct', async (product) => {
        try {
            const result = await productManager.addProduct(product);
            const products = await productManager.getProducts();
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
            await productManager.deleteProduct(id);
            const products = await productManager.getProducts();
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
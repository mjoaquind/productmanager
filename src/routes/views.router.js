import { Router } from 'express';
//import ProductManager from "../dao/fileManagers/ProductManager.js";
//import productsModel from '../dao/models/products.model.js';
import ProductManager from '../dao/mongoManagers/ProductManager.js';
import CartManager from "../dao/mongoManagers/CartManager.js";
import __dirname from "../utils.js";

const router = Router();

//const path = `${__dirname}/dao/fileManagers/files/Products.json`;
//const productManager = new ProductManager(path);
const productManager = new ProductManager();
const cartManager = new CartManager();

const publicAccess = (req, res, next) => {
    if(req.session.user) {
        return res.redirect('/');
    }
    next();
}

const privateAccess = (req, res, next) => {
    if(!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

router.get('/carts/:cid', privateAccess, async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    const user = req.session.user;
    res.render('cart', { cart, user });
});

router.get('/products', privateAccess, async (req, res) => {
    const {limit, page, sort, category, stock} = req.query;
    const options = {
        lean: true,
        limit: limit ?? 10,
        page: page ?? 1,
        sort: {price: sort === "asc" ? 1 : -1}
    }

    const filter = {}        
    if(category) filter.category = category
    if(stock) filter.stock = stock

    const products = await productManager.getProducts(filter, options);
    const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products;
    //const products = await productsModel.find().lean();

    let rutaBase = `http://localhost:8080/products/?`
    if (limit) rutaBase+=`limit=${limit}`
    if (sort) rutaBase+=`&sort=${sort}`
    if (category) rutaBase+=`&category=${category}`
    if (stock) rutaBase+=`&stock=${stock}`

    res.render('products',{
        status: "success",
        products: docs,
        user: req.session.user,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `${rutaBase}&page=${prevPage}` : null,
        nextLink: hasNextPage ? `${rutaBase}&page=${nextPage}` : null
    });
});

router.get('/register', publicAccess, (req, res) => {
    res.render('register')
})

router.get('/login', publicAccess, (req, res) => {
    res.render('login')
})

router.get('/resetPassword', (req, res) => {
    res.render('resetPassword')
})

router.get('/', privateAccess, (req, res) => {
    res.render('profile', {user: req.session.user})
})

router.get('/realtimeproducts', async (req, res) => {
    //const products = await productManager.getProducts();
    //const products = await productsModel.find().lean();
    const {limit, page, sort, category, stock} = req.query;
    const options = {
        lean: true,
        limit: limit ?? 10,
        page: page ?? 1,
        sort: {price: sort === "asc" ? 1 : -1}
    }

    const filter = {}        
    if(category) filter.category = category
    if(stock) filter.stock = stock

    const products = await productManager.getProducts(filter, options);
    const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products;

    let rutaBase = `http://localhost:8080/realtimeproducts`
    if (limit) rutaBase+=`?limit=${limit}`
    if (sort) rutaBase+=`&sort=${sort}`
    if (category) rutaBase+=`&category=${category}`
    if (stock) rutaBase+=`&stock=${stock}`

    res.render('realTimeProducts',{
        status: "success",
        products: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `${rutaBase}&page=${prevPage}` : null,
        nextLink: hasNextPage ? `${rutaBase}&page=${nextPage}` : null
    });

});

router.get('/chat', async (req, res) => {
    res.render('chat',{});

});

export default router;
import { Router } from 'express';
//import ProductManager from "../dao/fileManagers/ProductManager.js";
import productsModel from '../dao/models/products.model.js';
import ProductManager from '../dao/mongoManagers/ProductManager.js';
import CartManager from "../dao/mongoManagers/CartManager.js";
import __dirname from "../utils.js";

const router = Router();

//const path = `${__dirname}/dao/fileManagers/files/Products.json`;
//const productManager = new ProductManager(path);
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/carts/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    res.render('cart', cart);
});

router.get('/products', async (req, res) => {
    const {limit, page, sort, category, price} = req.query;
    const options = {
        lean: true,
        limit: limit ?? 10,
        page: page ?? 1,
        sort: {price: sort === "asc" ? 1 : -1}
    }

    const products = await productManager.getProducts({}, options);
    const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products;
    //const products = await productsModel.find().lean();

    res.render('products',{
        status: "success",
        products: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `http://localhost:8080/products?limit=${limit}&page=${prevPage}` : null,
        nextLink: hasNextPage ? `http://localhost:8080/products?limit=${limit}&page=${nextPage}` : null
    });
});


router.get('/realtimeproducts', async (req, res) => {
    //const products = await productManager.getProducts();
    //const products = await productsModel.find().lean();
    const {limit, page, sort, category, price} = req.query;
    const options = {
        lean: true,
        limit: limit ?? 10,
        page: page ?? 1,
        sort: {code: sort === "asc" ? 1 : -1}
    }

    const products = await productManager.getProducts({}, options);
    const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products;

    res.render('realTimeProducts',{
        status: "success",
        products: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `http://localhost:8080/realtimeproducts?limit=${limit}&page=${prevPage}` : null,
        nextLink: hasNextPage ? `http://localhost:8080/realtimeproducts?limit=${limit}&page=${nextPage}` : null
    });

});

router.get('/chat', async (req, res) => {
    res.render('chat',{});

});

export default router;
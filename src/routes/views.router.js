import { Router } from 'express';
//import ProductManager from "../dao/fileManagers/ProductManager.js";
import productsModel from '../dao/models/products.model.js';
import ProductManager from '../dao/mongoManagers/ProductManager.js';
import __dirname from "../utils.js";

const router = Router();

//const path = `${__dirname}/dao/fileManagers/files/Products.json`;
//const productManager = new ProductManager(path);
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const {limit, page, sort, category, price} = req.query;
    const options = {
        lean: true,
        limit: limit ?? 10,
        page: page ?? 1,
        sort: {code: sort === "asc" ? 1 : -1}
    }

    const products = await productManager.getProducts({}, options);
    const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products;
    //const products = await productsModel.find().lean();
    
    res.render('home',{products:docs});
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

    res.render('realTimeProducts',{products:docs});

});

router.get('/chat', async (req, res) => {
    res.render('chat',{});

});

export default router;
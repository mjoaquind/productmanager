import { Router } from 'express';
import ProductManager from "../managers/ProductManager.js";
import __dirname from "../utils.js";

const router = Router();

const path = `${__dirname}/files/Products.json`;
const productManager = new ProductManager(path);

router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;

    const products = await productManager.getProducts();

    if(limit == 0){
        res.render('home',{products});
    } else {
        const resultado = products.slice(0,limit);
        res.render('home',{products: resultado});
    }
});


router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts',{products});

});

export default router;
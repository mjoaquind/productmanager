import { Router } from 'express';
import { checkRole, verifyEmailTokenMW } from '../middlewares/auth.js';
//import ProductManager from "../dao/fileManagers/ProductManager.js";
//import productsModel from '../dao/models/products.model.js';
import { ViewController } from '../controllers/views.controller.js';

const router = Router();

const publicAccess = (req, res, next) => {
    if(req.session.user) {
        return res.redirect('/products');
    }
    next();
}

const privateAccess = (req, res, next) => {
    if(!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

router.get('/carts/:cid', privateAccess, ViewController.getCartById);

router.get('/products', privateAccess, ViewController.getProducts);

router.get('/register', publicAccess, ViewController.register);

router.get('/login', publicAccess, ViewController.login);

router.get('/resetPassword', ViewController.resetPassword);

router.get('/forgotPassword', ViewController.forgotPassword);

router.get('/restorePassword', verifyEmailTokenMW(), ViewController.restorePassword);

router.get('/', privateAccess, ViewController.profile);

router.get('/realtimeproducts', ViewController.getRealTimeProducts);

router.get('/chat', checkRole('user'), ViewController.chat);

export default router;
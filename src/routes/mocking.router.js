import { Router } from 'express';
import compression from 'express-compression';
import { mockingProducts } from '../utils/faker.js';

const router = Router();

router.get('/', (req, res) => {
    const products = mockingProducts();
    res.send({ status: 'success', payload: products})
})

router.get('/brotli', compression({brotli:{enable:true, zlib:{}}}), (req, res) => {
    const products = mockingProducts();
    res.send({ status: 'success', payload: products})
})

export default router;
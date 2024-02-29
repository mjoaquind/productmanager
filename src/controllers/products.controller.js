import { productService } from "../repository/index.js";
import { CustomError } from '../utils/errors/customError.service.js';
import { EError } from '../utils/errors/EError.js'
import { generateProductErrorInfo } from '../utils/errors/productErrorInfo.js';
import { generateProductErrorParam } from '../utils/errors/productErrorParam.js';

class ProductController {
    static getProducts = async (req, res) => {
        try {
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
    
            const products = await productService.getProducts(filter, options);
    
            const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products;
    
            let rutaBase = `http://localhost:8080/api/products/?`
            if (limit) rutaBase+=`limit=${limit}`
            if (sort) rutaBase+=`&sort=${sort}`
            if (category) rutaBase+=`&category=${category}`
            if (stock) rutaBase+=`&stock=${stock}`
    
            res.status(200).send({ 
                status: "success",
                payload: docs,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `${rutaBase}&page=${prevPage}` : null,
                nextLink: hasNextPage ? `${rutaBase}&page=${nextPage}` : null
            });
        } catch (error) {
            res.status(400).send({
                status: "error",
                message: error.message
            });
        }
    }

    static getProductById = async (req, res) => {
        try {
            
            const product = await productService.getProductById({ _id: req.params.pid });
            res.status(200).send({product});
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static addProduct = async (req, res) => {
        try {
            const {
                title,
                description,
                price,
                thumbnail = [],
                code,
                stock,
                status = true,
                category
            } = req.body;

            if (!title || !description || !price || !category || !code || !stock) {
                CustomError.createError({
                    name: 'Product creation error',
                    cause: generateProductErrorInfo(req.body),
                    message: 'Some required fields are empty',
                    errorCode: EError.INVALID_PARAM_ERROR
                })
                //return res.status(400).send({ status: "error", message: error.message });
            }

            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status,
                category
            }

            const result = await productService.addProduct(product);
            res.status(200).send({result});
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static updateProduct = async (req, res) => {
        try {
            const id = req.params.pid;
            const {
                title,
                description,
                price,
                thumbnail = [],
                code,
                stock,
                status = true,
                category
            } = req.body;
    
            if (!title || !description || !price || !category || !code || !stock) {
                return res.status(400).send({ status: "error", message: error.message });
            }
    
            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status,
                category
            }
    
            const result = await productService.updateProduct(id, product);
            res.status(200).send({result});
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static deleteProduct = async (req, res) => {
        try {
            const id = req.params.pid;
            let result = await productService.deleteProduct(id);
            res.status(200).send({result});
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }
}

export { ProductController }
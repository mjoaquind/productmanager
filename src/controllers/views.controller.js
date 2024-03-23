import { productService, cartService } from "../repository/index.js";


class ViewController {
    static getCartById = async (req, res) => {
        const cart = await cartService.getCartById(req.params.cid);
        const user = req.session.user;
        res.render('cart', { cart, user });
    }

    static getProducts = async (req, res) => {
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
    }

    static getRealTimeProducts = async (req, res) => {
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
    }

    static login = (req, res) => {
        res.render('login')
    }

    static resetPassword = (req, res) => {
        res.render('resetPassword')
    }

    static forgotPassword = (req, res) => {
        res.render('forgotPassword')
    }

    static restorePassword = (req, res) => {
        const token = req.query.token;
        res.render('restorePassword', {token})
    }

    static profile = (req, res) => {
        res.render('profile', {user: req.session.user})
    }

    static register = (req, res) => {
        res.render('register')
    }

    static chat = async (req, res) => {
        res.render('chat',{});
    }
}

export { ViewController }
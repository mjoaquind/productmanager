import ProductManager from "../dao/fileManagers/ProductManager.js";
import __dirname from "../utils.js";

const path = `${__dirname}/dao/fileManagers/files/Products.json`;
const productManager = new ProductManager(path);
class FileProductController {
    static getProducts = async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 0;
    
            const products = await productManager.getProducts();
            
            if(limit == 0){
                res.send({products});
            } else {
                const resultado = products.slice(0,limit);
                res.send({products: resultado});
            }
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static getProductById = async (req, res) => {
        try {
            const pid = req.params.pid;
            const product = await productManager.getProductById(parseInt(pid));
            res.send({product});
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static addProduct = async (req, res) => {
        try {
            const product = req.body.product;
            const products = await productManager.addProduct(product);
            res.send({
                status:"success",
                message: "Product created",
                productos: {products}
            })
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static updateProduct = async (req, res) => {
        try {
            const pid = req.params.pid;
            const product = req.body.product;
            const products = await productManager.updateProduct(parseInt(pid), product);
            res.send({
                status:"success",
                message: `Product ${pid} updated`,
                productos: {products}
            })
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static deleteProduct = async (req, res) => {
        try {
            const pid = req.params.pid;
            const product = await productManager.deleteProduct(parseInt(pid));
            res.send({
                status:"success",
                message: `Product ${pid} deleted`,
                productos: {product}
            })
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }
}

export { FileProductController }
class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = async (filter, options) => {
        return await this.dao.getProducts(filter, options);
    }

    getProductById = async (pid) => {
        return await this.dao.getProductById(pid);
    }

    addProduct = async (product) => {
        return await this.dao.addProduct(product);
    }

    updateProduct = async (pid, product) => {
        return await this.dao.updateProduct(pid, product);
    }

    deleteProduct = async (pid) => {
        return await this.dao.deleteProduct(pid);
    }
}

export default ProductsRepository;
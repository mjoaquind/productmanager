class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getCarts() {
        return await this.dao.getCarts();
    }

    async getCartById(cid) {
        return await this.dao.getCartById(cid);
    }

    async createCart() {
        return await this.dao.createCart();
    }

    async addProductToCart(cid, pid, quantity = 1) {
        return await this.dao.addProductToCart(cid, pid, quantity);
    }

    async updateProductQuantity(cid, pid, quantity) {
        return await this.dao.updateProductQuantity(cid, pid, quantity);
    }

    async updateCart(cid, products) {
        return await this.dao.updateCart(cid, products);
    }

    async deleteCart(cid) {
        return await this.dao.deleteCart(cid);
    }

    async deleteProductFromCart(cid, pid) {
        return await this.dao.deleteProductFromCart(cid, pid);
    }
}

export default CartsRepository;
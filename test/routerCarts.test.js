import { app } from '../src/app.js';
import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest(app);

describe('Test Carts Router', () => {

        it('GET /api/carts/ should return a list of carts', async () => {
            const result = await requester.get('/api/carts/');
            const { status, body } = result;
            expect(status).to.be.equal(200);
            expect(body.carts).to.be.an('array');
        })

        it('GET /api/carts/:cid should return a cart by id', async () => {
            const cid = '65de657e4a87bd1574089a60';
            const result = await requester.get(`/api/carts/${cid}`);
            const { status, body } = result;
            expect(status).to.be.equal(200);
            expect(body.cart).to.have.property('products');
            expect(body.cart.products).to.be.an('array');
        })

        it('POST /api/carts/ should create a new empty cart', async () => {
            const result = await requester.post('/api/carts/');
            const { status, body } = result;
            expect(status).to.be.equal(200);
            expect(body.status).to.be.equal("success");
        })

        it('DELETE /api/carts/:cid should empty a cart', async () => {
            const cid = '661071c53f14536c89ed0fa1';
            const result = await requester.delete(`/api/carts/${cid}`);
            const { status, body } = result;
            expect(status).to.be.equal(200);
            expect(body.status).to.be.equal("success");
        })

        /*
        it('DELETE /api/carts/:cid/products/:pid should delete a product from cart by id', async function() {
            const cid = '';
            const pid = '';
            const result = await requester.delete(`/api/carts/${cid}/products/${pid}`);
            const { status, body } = result;
            expect(status).to.be.equal(200);
            expect(body.status).to.be.equal("success");
        })
        */
})
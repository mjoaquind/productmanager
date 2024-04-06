import { app } from '../src/app.js';
import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest(app);

describe('Test Products Router', () => {

        it('GET /api/products/ should return a list of products', async () => {
            const result = await requester.get('/api/products/');
            const { status, body } = result;
            expect(status).to.be.equal(200);
            expect(body.payload).to.be.an('array');
        })

        it('GET /api/products/:pid should return a product by id', async () => {
            const pid = '65838536472f0b4d94b0b856';
            const result = await requester.get(`/api/products/${pid}`);
            const { status, body } = result;
            expect(status).to.be.equal(200);
            expect(body.product).to.have.property('category');
            expect(body.product.thumbnail).to.be.an('array');
        })

})
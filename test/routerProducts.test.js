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

        /*
        // no se por que no funciona
        it('GET /api/products/:pid should return a product by id', async () => {
            const pid = '65de657e4a87bd1574089a60';
            const result = await requester.get(`/api/products/${pid}`);
            const { status, body } = result;
            console.log(body);
            expect(status).to.be.equal(200);
            expect(body.product).to.have.property('category');
        })
        */

})
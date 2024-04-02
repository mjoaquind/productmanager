import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing e-commerce', () => {
    describe('Test de productos', () => {
        it('El endpoint PUT /api/products debe crear un producto', async () => {
            const productMock = {
                title: 'test',
                description: 'test',
                price: 1,
                status: true,
                category: 'test',
                thumbnail: 'test',
                code: 'test',
                stock: 1
            }
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/products').send(productMock);
            console.log(statusCode);
            console.log(ok);
            console.log(_body);
            expect(_body.playload).to.have.property('_id');
        })
    })
})
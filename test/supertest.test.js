import { expect } from 'chai';
import supertest from 'supertest';
import { productService } from '../src/repository/index.js';

const requester = supertest('http://localhost:8080');

describe('Testing de App e-commerce', () => {
    describe('Test de Productos', () => {
        it('El endpoint PUT /api/products debe crear un producto', async () => {
            const productMock = {
                title: 'test',
                description: 'test',
                price: 1,
                status: true,
                category: 'test',
                thumbnail: [],
                code: 'test',
                stock: 1,
                owner: null
            }
            const result = await requester.post('/api/products').send(productMock);
            expect(result).to.have.property('_id');
        })
    })
})
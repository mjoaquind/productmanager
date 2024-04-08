import { app } from '../src/app.js';
import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest(app);

const user = {
    email: 'prueba@email.com',
    password: '123456'
}

describe('Test Products Router', () => {
    let cookie;
    before(async () => {
        const login = await requester.post('/api/session/login').send({email: user.email, password: user.password}).expect(200);
        cookie = login.headers['set-cookie'].find((cookie) => cookie.startsWith('connect.sid'));
    })

    it('POST /api/session/login should login a user', async () => {
        const result = await requester.post('/api/session/login').send({email: user.email, password: user.password}).expect(200);
        const { status, body } = result;
        expect(status).to.be.equal(200);
        expect(body.payload).to.have.property('first_name');
    })

    it('GET /api/sesssion/current should return current user', async () => {
        const result = await requester.get('/api/session/current').set('Cookie', cookie);
        const { status, body } = result;
        expect(status).to.be.equal(200);
        expect(body.payload).to.have.property('first_name');
    })

    it('PUT /api/users/premium/:id should change user role from user to premium or premium to user', async () => {
        const id = '661474823be32fa169668f8e';
        const result = await requester.put(`/api/users/premium/${id}`);
        const { status, body } = result;
        expect(status).to.be.equal(200);
        expect(body.status).to.be.equal('success');
    })
})
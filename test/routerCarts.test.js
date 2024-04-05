import { app } from '../src/app.js';
import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest(app);

describe("Test Carts Router", () => {

        it('GET /api/carts/ should return a list of carts', async () => {
            const result = await requester.get("/api/carts/");
            const { status, body } = result;
            expect(status).to.be.equal(200);
            expect(body.carts).to.be.an('array');
        })

        it("POST /api/carts/ should create a new cart", async () => {
            const cartsMock = {
                products: [
                    {
                        product: '65838536472f0b4d94b0b856',
                        quantity: 5
                    }
                ]
            }
            const result = await requester.post("/api/carts/").send(cartsMock);
            const { status, body } = result;
            expect(status).to.be.equal(200);
            expect(body.status).to.be.equal("success");
        })

        it("GET /api/carts/:cid should return a cart by id", async () => {
            const existingCartId = '65de657e4a87bd1574089a60';
            const result = await requester.get(`/api/carts/${existingCartId}`);
            const { status, body } = result;
            expect(status).to.be.equal(200);
            expect(body.cart).to.have.property('products');
            expect(body.cart.products).to.be.an('array');
        })
})
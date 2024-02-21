import { options } from '../config/config.js';

const persistence = options.server.persistence;

let ticketDAO;
let productsDAO;
let cartsDAO;
let usersDAO;

switch (persistence) {
    case 'MONGO':
        const { connectDB } = await import('../config/connectDB.js');
        connectDB();

        const { TicketDAO } = await import('./managers/mongo/TicketDAO.js');
        ticketDAO = new TicketDAO();
        const { ProductDAO } = await import('./managers/mongo/ProductDAO.js');
        productsDAO = new ProductDAO();
        const { CartDAO } = await import('./managers/mongo/CartDAO.js');
        cartsDAO = new CartDAO();
        const { UserDAO } = await import('./managers/mongo/UserDAO.js');
        usersDAO = new UserDAO();
        break;
}

export { ticketDAO, productsDAO, cartsDAO, usersDAO }
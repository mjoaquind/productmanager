import { options } from '../config/config.js';

const persistence = options.server.persistence;

let ticketsDAO;
let productsDAO;
let cartsDAO;
let usersDAO;

switch (persistence) {
    case 'MONGO':
        const { ConnectDB } = await import('../config/connectDB.js');
        const coneccion = ConnectDB.getInstance();

        const { TicketDAO } = await import('./managers/mongo/TicketDAO.js');
        ticketsDAO = new TicketDAO();
        const { ProductDAO } = await import('./managers/mongo/ProductDAO.js');
        productsDAO = new ProductDAO();
        const { CartDAO } = await import('./managers/mongo/CartDAO.js');
        cartsDAO = new CartDAO();
        const { UserDAO } = await import('./managers/mongo/UserDAO.js');
        usersDAO = new UserDAO();
        break;
}

export { ticketsDAO, productsDAO, cartsDAO, usersDAO }
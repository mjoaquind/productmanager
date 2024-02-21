import { options } from '../config/config.js';

const persistence = options.server.persistence;

let ticketDAO;
let productDAO;
let messageDAO;
let cartsDAO;
let usersDAO;

switch (persistence) {
    case 'MONGO':
        const { connectionDB } = await import('../config/connectionDB.js');
        connectionDB.getInstance();

        const { TicketDAO } = await import('./managers/mongo/TicketDAO.js');
        ticketDAO = new TicketDAO();
        const { ProductDAO } = await import('./managers/mongo/ProductDAO.js');
        productDAO = new ProductDAO();
        const { MessageDAO } = await import('./managers/mongo/MessageDAO.js');
        messageDAO = new MessageDAO();
        const { CartsDAO } = await import('./managers/mongo/CartsDAO.js');
        cartsDAO = new CartsDAO();
        const { UsersDAO } = await import('./managers/mongo/UsersDAO.js');
        usersDAO = new UsersDAO();
        break;
}

export { ticketDAO, productDAO, messageDAO, cartsDAO, usersDAO }
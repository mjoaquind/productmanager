import TicketsRepository from "./tickets.repository.js";
import TicketDAO from "../dao/managers/mongo/TicketDAO.js";

import ProductsRepository from "./products.repository.js";
import ProductDAO from "../dao/managers/mongo/ProductDAO.js";

import CartsRepository from "./carts.repository.js";
import CartDAO from "../dao/managers/mongo/CartDAO.js";

import UsersRepository from "./users.repository.js";
import UserDAO from "../dao/managers/mongo/UserDAO.js";

export const ticketService = new TicketsRepository(TicketDAO);
export const productService = new ProductsRepository(ProductDAO);
export const cartService = new CartsRepository(CartDAO);
export const userService = new UsersRepository(UserDAO);
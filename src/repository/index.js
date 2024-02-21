import { ticketsDAO, productsDAO, cartsDAO, usersDAO  } from "../dao/factory.js";

import TicketsRepository from "./tickets.repository.js";
import ProductsRepository from "./products.repository.js";
import CartsRepository from "./carts.repository.js";
import UsersRepository from "./users.repository.js";

export const ticketService = new TicketsRepository(ticketsDAO);
export const productService = new ProductsRepository(productsDAO);
export const cartService = new CartsRepository(cartsDAO);
export const userService = new UsersRepository(usersDAO);
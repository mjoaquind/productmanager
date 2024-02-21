import ticketsModel from "../../models/tickets.model.js";

export class TicketDAO {

    constructor() {
        this.tickets = ticketsModel;
    }
    createTicket = async (ticket) => {
        const newTicket = await this.tickets.create(ticket);
        return newTicket;
    }

    getTickets = async () => {
        const tickets = await this.tickets.find();
        return tickets;
    }

    getTicketById = async (id) => {
        const ticket = await this.tickets.findById(id);
        return ticket;
    }
}
import ticketsModel from "../../models/tickets.model.js";

export class TicketDAO {

    constructor() {
        this.ticketsModel = ticketsModel;
    }
    async createTicket(ticket) {
        const newTicket = await this.ticketsModel.create(ticket);
        return newTicket;
    }

    async getTickets() {
        const tickets = await this.ticketsModel.find();
        return tickets;
    }

    async getTicketById(id) {
        const ticket = await this.ticketsModel.findById(id);
        return ticket;
    }
}
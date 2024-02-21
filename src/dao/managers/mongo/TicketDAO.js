import ticketsModel from "../../models/tickets.model.js";

class TicketDAO {
    async createTicket(ticket) {
        const newTicket = await ticketsModel.create(ticket);
        return newTicket;
    }

    async getTickets() {
        const tickets = await ticketsModel.find();
        return tickets;
    }

    async getTicketById(id) {
        const ticket = await ticketsModel.findById(id);
        return ticket;
    }
}

export default TicketDAO;
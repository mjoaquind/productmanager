class TicketsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getTickets() {
        const tickets = await this.dao.getTickets();
        return tickets;
    }

    async getTicketById(id) {
        return await this.dao.getTicketById(id);
    }

    async createTicket(ticket) {
        return await this.dao.createTicket(ticket);
    }
}

export default TicketsRepository;
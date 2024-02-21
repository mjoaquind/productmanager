import { ticketService } from "../repository/index.js";

class TicketController {
    getTickets = async (req, res) => {
        try {
            const tickets = await ticketService.getTickets();
            res.send({tickets});
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    getTicketById = async (req, res) => {
        try {
            const tid = req.params.tid;
            const ticket = await ticketService.getTicketById(tid);
            res.send({ticket});
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    createTicket = async (req, res) => {
        try {
            const ticket = await ticketService.createTicket();
            res.send({ticket});
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }
}

export { TicketController };
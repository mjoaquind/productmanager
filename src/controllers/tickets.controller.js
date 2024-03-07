import { ticketService } from "../repository/index.js";

class TicketController {
    getTickets = async (req, res) => {
        try {
            const tickets = await ticketService.getTickets();
            req.logger.info(`List of tickets obtained!`);
            res.send({tickets});
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    getTicketById = async (req, res) => {
        try {
            const tid = req.params.tid;
            const ticket = await ticketService.getTicketById(tid);
            req.logger.info(`Ticket ${tid} obtained!`);
            res.send({ticket});
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    createTicket = async (req, res) => {
        try {
            const ticket = await ticketService.createTicket();
            req.logger.info(`Ticket ${ticket._id} created!`);
            res.send({ticket});
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }
}

export { TicketController };
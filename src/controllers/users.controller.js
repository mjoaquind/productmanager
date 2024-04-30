import { sendDeleteUserEmail, sendDeleteUserByAdminEmail } from '../utils/gmail.js';
import { userService } from '../repository/index.js';

class UserController {
    static getUsers = async (req, res) => {
        try {
            const users = await userService.getUsers();
            req.logger.info(`List of users obtained!`);
            res.send({users});
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static getSomeUsers = async (req, res) => {
        try {
            const users = await userService.getUsers();
            const usersList = users.map(user => ({
                first_name: user.first_name,
                email: user.email,
                role: user.role
            }));
            req.logger.info(`List of users obtained!`);
            res.send({users: usersList});
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static changeRole = async (req, res) => {
        try {
            const uid = req.params.uid;
            const user = await userService.getUserById(uid);
            if(!user) {
                req.logger.error(`User ${uid} not found!`);
                return res.status(404).send({ status: "error", message: "User not found" });
            }
            if(user.role === 'admin') {
                req.logger.error(`User ${uid} is admin!`);
                return res.status(400).send({ status: "error", message: "User is admin" });
            }
            let role = user.role;
            if(role === 'user') {
                const documents = user.documents;
                if(documents.length > 0) {
                    documents.map(doc => {
                        if(!doc.name === 'identity' || !doc.name === 'address' || !doc.name === 'account') {
                            req.logger.error(`User ${uid} has to complete upload documents!`);
                            return res.status(400).send({ status: "error", message: "User has to complete upload documents" });
                        }
                    })
                } else {
                    req.logger.error(`User ${uid} has to complete upload documents!`);
                    return res.status(400).send({ status: "error", message: "User has to complete upload documents" });
                }
            }
            switch (user.role) {
                case 'premium': role = 'user';
                    break;
                case 'user': role = 'premium';
                    break;
            }
            await userService.changeRole(uid, role);
            req.logger.info(`User ${uid} role changed to ${role}!`);
            res.send({ status: "success", message: `User ${uid} role changed to ${role}` });
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static addDocuments = async (req, res) => {
        try {
            const uid = req.params.uid;
            const file = req.files;

            const docName= file[0].filename;
            const docReference= file[0].destination;

            const user = await userService.getUserById(uid);
            if(!user) {
                req.logger.error(`User ${uid} not found!`);
                return res.status(404).send({ status: "error", message: "User not found" });
            }

            await userService.addDocuments(uid, docName, docReference);

            req.logger.info(`User ${uid} documents uploaded!`);
            res.send({ status: "success", message: `User ${uid} documents uploaded` });
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static deleteUsers = async (req, res) => {
        try {
            const users = await userService.getUsers();
            const currentDate = new Date();
            const twooDaysAgo = new Date(currentDate);
            twooDaysAgo.setDate(currentDate.getDate() - 2);

            const usersToDelete = users.filter(user => {
                return user.last_connection <= twooDaysAgo;
            });

            if (usersToDelete.length > 0) {
                for (const user of usersToDelete) {
                    sendDeleteUserEmail(user.email, user.last_connection);
                    await userService.deleteUser(user.id);
                }
            }

            req.logger.info(`Users whose last connection was less than 30 minutes ago deleted!`);
            res.send({ status: "success", message: `Users whose last connection was less than 30 minutes ago deleted: ${usersToDelete.email}` });
        } catch (error) {
            throw new Error(`Error deleting users: ${error.message}`);
        }
    }

    static deleteUser = async (req, res) => {
        try {
            const uid = req.params.uid;
            const user = await userService.getUserById(uid);
            if(!user) {
                req.logger.error(`User ${uid} not found!`);
                return res.status(404).send({ status: "error", message: "User not found" });
            }
            await userService.deleteUser(uid);
            sendDeleteUserByAdminEmail(user.email);
            req.logger.info(`User ${uid} deleted!`);
            res.send({ status: "success", message: `User ${uid} deleted` });
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }
}

export { UserController }
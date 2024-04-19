import { userService } from '../repository/index.js';

class UserController {
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
}

export { UserController }
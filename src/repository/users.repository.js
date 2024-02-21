//import { getUserDTO } from '../dao/dto/users.dto.js';

class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getUsers = async () => {
        return await this.dao.getUsers();
    }

    getUserById = async (id) => {
        const user = await this.dao.getUserById(id);
        //const userDTO = new getUserDTO(user);
        //return userDTO;
        return user;
    }

    getByEmail = async (email) => {
        return await this.dao.getByEmail(email);
    }

    getByEmailAndPassword = async (email, password) => {
        return await this.dao.getByEmailAndPassword(email, password);
    }

    createUser = async (user) => {
        return await this.dao.createUser(user);
    }

    updatePassword = async (id, password) => {
        return await this.dao.updatePassword(id, password);
    }
}

export default UsersRepository;
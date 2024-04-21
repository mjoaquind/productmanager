import getUsersDTO from '../dao/dto/users.dto.js';

class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getUsers = async () => {
        return await this.dao.getUsers();
    }

    getUserById = async (id) => {
        return await this.dao.getUserById(id);
    }

    getUserByIdDTO = async (id) => {
        const user = await this.dao.getUserById(id);
        const userDTO = new getUsersDTO(user);
        return userDTO;
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

    updateLastConnection = async (id) => {
        return await this.dao.updateLastConnection(id);
    }

    addDocuments = async (id, docName, docReference) => {
        return await this.dao.addDocuments(id, docName, docReference);
    }

    changeRole = async (id, role) => {
        return await this.dao.changeRole(id, role);
    }

    deleteUser = async (id) => {
        return await this.dao.deleteUser(id);
    }
}

export default UsersRepository;
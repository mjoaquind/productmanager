import usersModel from "../../models/users.model.js";
import { CartDAO } from './CartDAO.js';

export class UserDAO {

    constructor() {
        this.users = usersModel;
    }

    getUsers = async () => {
        const users = await this.users.find();
        return users;
    }

    getUserById = async (id) => await this.users.findById(id);

    getByEmail = async (email) => {
        const user = await this.users.findOne({ email });
        return user;
    }

    getByEmailAndPassword = async (email, password) => {
        const user = await this.users.findOne({ email, password });
        return user;
    }

    getByCartId = async (cid) => {
        const user = await this.users.findOne({ cart: cid });
        return user;
    }

    createUser = async (user) => {
        const cartDAO = new CartDAO();
        const cart = await cartDAO.createCart();
        user.cart = cart._id;
        const newUser = await this.users.create(user);
        return newUser;
    }

    updatePassword = async (id, password) => {
        const user = await this.users.updateOne({ _id: id }, { password });
        return user;
    }

    updateLastConnection = async (id) => {
        const user = await this.users.updateOne({ _id: id }, { last_connection: new Date() });
        return user;
    }

    addDocument = async (uid, document_name, document_reference, document_type) => {
        const user = this.users.findById(uid);
        const update = { $push: { documents: { name: document_name, reference: document_reference, document_type: document_type } } };
        const updatedUser = await this.users.updateOne({ _id: uid }, update);
        return updatedUser;
    }

    changeRole = async (id, role) => {
        const user = await this.users.updateOne({ _id: id }, { role });
        return user;
    }
}
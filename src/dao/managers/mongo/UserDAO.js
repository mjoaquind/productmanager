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
}
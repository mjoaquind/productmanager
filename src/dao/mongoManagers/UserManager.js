import usersModel from "../models/users.model.js";
import CartManager from './CartManager.js';

class UserManagerMongo {
    getUsers = async () => {
        const users = await usersModel.find();
        return users;
    }

    getUserById = async (id) => await usersModel.findById(id);

    getByEmail = async (email) => {
        const user = await usersModel.findOne({ email });
        return user;
    }

    getByEmailAndPassword = async (email, password) => {
        const user = await usersModel.findOne({ email, password });
        return user;
    }

    createUser = async (user) => {
        const cartManager = new CartManager();
        const cart = await cartManager.createCart();
        user.cart = cart._id;
        const newUser = await usersModel.create(user);
        return newUser;
    }

    updatePassword = async (id, password) => {
        const user = await usersModel.updateOne({ _id: id }, { password });
        return user;
    }
}

export default UserManagerMongo;
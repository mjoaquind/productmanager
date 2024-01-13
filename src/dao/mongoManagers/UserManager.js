import usersModel from "../models/users.model.js";

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
        const newUser = await usersModel.create(user);
        return newUser;
    }

    updatePassword = async (id, password) => {
        const user = await usersModel.updateOne({ _id: id }, { password });
        return user;
    }
}

export default UserManagerMongo;
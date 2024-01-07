import usersModel from "../models/users.model.js";

class UserManagerMongo {
    getUsers = async () => {
        const users = await usersModel.find();
        return users;
    }

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
}

export default UserManagerMongo;
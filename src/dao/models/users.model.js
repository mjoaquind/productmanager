import mongoose from "mongoose";

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    age: { type: Number },
    password: { type: String }
});

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;
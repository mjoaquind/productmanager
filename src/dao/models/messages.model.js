import mongoose from "mongoose";

const collection = 'Carts';

const messagesSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true }
});

const messagesModel = mongoose.model(collection, messagesSchema);

export default messagesModel;
import mongoose from "mongoose";

const collection = 'Messages';

const messagesSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true }
},
{
    timestamps: true
});

const messagesModel = mongoose.model(collection, messagesSchema);

export default messagesModel;
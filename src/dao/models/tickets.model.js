import mongoose from "mongoose";

const ticketsCollection = 'tickets';

const ticketsSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
},
{
    timestamps: {
        createdAt: 'purasche_datetime'
    }
});

const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);

export default ticketsModel;
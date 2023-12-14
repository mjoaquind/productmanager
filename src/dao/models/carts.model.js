import mongoose from "mongoose";

const collection = 'Carts';

const cartsSchema = new mongoose.Schema({
    products: { type: Array, required: true, default: [] }
});

const cartsModel = mongoose.model(collection, cartsSchema);

export default cartsModel;
import mongoose from "mongoose";

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: Array, required: true, default: [] },
    code: { type: String, unique: true, required: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, required: true, default: true },
    category: { type: String, required: true }
});

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;
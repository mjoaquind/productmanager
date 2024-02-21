import mongoose from "mongoose";
import { options } from './config.js';

const MONGO = `mongodb+srv://${options.mongo.user}:${options.mongo.pass}@${options.mongo.cluster}.mongodb.net/ecommerce`;

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(`Hubo un error al conectarse a MongoDB: ${error}`);
    }
}
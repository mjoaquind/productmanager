import mongoose from "mongoose";
import { options } from './config.js';

const MONGO = `mongodb+srv://${options.mongo.user}:${options.mongo.pass}@${options.mongo.cluster}.mongodb.net/ecommerce`;

class ConnectDB {
    static #instance;

    constructor() {
        mongoose.connect(MONGO);
    }

    static async getInstance() {
        if (ConnectDB.#instance) {
            console.log("Ya estás conectado");
            return ConnectDB.#instance;
        } else {
            this.#instance = new ConnectDB();
            console.log("Conectado");
            return this.#instance
        }
    }
}

export { ConnectDB }
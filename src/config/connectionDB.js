import mongoose from "mongoose";
import { options } from '../config/config.js';

const MONGO = `mongodb+srv://${options.mongo.user}:${options.mongo.pass}@${options.mongo.cluster}.mongodb.net/ecommerce`;

class ConnectionDB {
    static #instance;
    constructor() {
        mongoose.connect(MONGO);
    }

    static async getInstance() {
        if(ConnectionDB.#instance) {
            console.log('Ya hay una instancia');
            return ConnectionDB.#instance;
        } else {
            this.#instance = new ConnectionDB();
            console.log('Se ha creado una nueva instancia de conexion a la base de datos');
            return this.#instance;
        }
    }
}

export { ConnectionDB };
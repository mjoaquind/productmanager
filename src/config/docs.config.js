import __dirname from "../dirname.js";
import swaggerJSDoc from "swagger-jsdoc";
import path from 'path';

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentation: API - e-commerce',
            version: '1.0.0',
            description: 'Definición de endpoints para e-commerce',
        }
    },
    apis:[`${path.join(__dirname, './docs/**/*.yaml')}`],
}

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
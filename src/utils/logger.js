import winston from 'winston';
import { options } from '../config/config.js';
import __dirname from '../dirname.js';
import path from 'path';

const devLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({level:'verbose'})
    ]
});

const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({level:'http'}),
        new winston.transports.File({filename:path.join(__dirname, '../logs/errores.log'), level:'warn'})
    ]
});

const currentEnv = options.server.environment || 'development';

export const addLogger = (req, res, next) => {
    if(currentEnv === 'development'){
        req.logger = devLogger;
        console.log('DEV');
    }else{
        req.logger = prodLogger;
        console.log('PROD');
    }
    req.logger.http(`${req.url} - method: ${req.method}`);
    next();
}
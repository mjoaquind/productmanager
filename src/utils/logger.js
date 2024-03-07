import winston from 'winston';
import { options } from '../config/config.js';
import __dirname from '../dirname.js';
import path from 'path';


const customLevels = {
    levels: {
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
}

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({level:'debug'})
    ]
});

const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({level:'info'}),
        new winston.transports.File({filename:path.join(__dirname, '../logs/errores.log'), level:'error'})
    ]
});

const currentEnv = options.server.environment || 'development';

export const addLogger = (req, res, next) => {

    switch (currentEnv) {
        case 'production':
            req.logger = prodLogger;
            console.log('PROD');
            break;
        default:
            req.logger = devLogger;
            console.log('DEV');
            break;
    }

    req.logger.info(`${req.url} - method: ${req.method}`);
    next();
}
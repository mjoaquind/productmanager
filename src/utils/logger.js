import winston from 'winston';
import { options } from '../config/config.js';
import __dirname from '../dirname.js';
import path from 'path';


const customLevels = {
    levels: {
        debug:5,
        http:4,
        info:3,
        warning:2,
        error:1,
        fatal:0
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
        new winston.transports.Console({level:'info'})
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
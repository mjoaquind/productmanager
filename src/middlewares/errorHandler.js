import { EError } from '../utils/errors/EError.js';

export const errorHandler = (error, req, res, next) => {
    console.log('error code:', error.code);
    console.log('error cause:', error.cause);
    switch (error.code) {
        case EError.ROUTING_ERROR:
            res.json({status: 'error', error: error.cause, message: error.message});
            break;
        case EError.DATABASE_ERROR:
            res.json({status: 'error', message: error.message});
            break;
        case EError.INVALID_JSON_ERROR:
            res.json({status: 'error', error: error.cause, message: error.message});
            break;
        case EError.AUTH_ERROR:
            res.json({status: 'error', error: error.cause, message: error.message});
            break;
        case EError.INVALID_PARAM_ERROR:
            res.json({status: 'error', error: error.cause});
            break;
        default:
            res.json({ status: 'error', message: 'Unexpected error' });
            break;
    }
}
import jwt from 'jsonwebtoken'
import { options } from '../config/config.js';

const PRIVATE_KEY = options.jwt.private_key;

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '1d' });
    return token;
}

export const authHeader = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401).send({status: 'error', error: 'No autorizado'})
    jwt.verify(token, PRIVATE_KEY, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
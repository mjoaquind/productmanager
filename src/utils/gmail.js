import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import {options} from '../config/config.js';

// credenciales
const MAILING_USER = options.gmail.user;
const MAILING_SECRET = options.gmail.pass;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: MAILING_USER,
        pass: MAILING_SECRET
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
})

export const recoverPassword = async (email, token) => {
    const url = `http://localhost:8080/restorePassword?token=${token}`;
    console.log(url);
    await transporter.sendMail({
        from: MAILING_USER,
        to: email,
        subject: 'Recover Password',
        html: `
        <div>
            <h2>Cambio de contraseña</h2>
            <a href="${url}">
                <button>Restablecer contraseña</button>
            </a>
        </div>
        `
    })
}

export const generateEmailToken = (email,expireTime)=>{
    const token = jwt.sign({email}, MAILING_SECRET,{expiresIn:expireTime});
    return token;
};

export const verifyEmailToken = (token)=>{
    try {
        const info = jwt.verify(token, MAILING_SECRET);
        console.log(info);
        return info.email;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};
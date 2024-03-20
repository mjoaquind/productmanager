import nodemailer from 'nodemailer';
import {options } from '../config/config.js';

// credenciales
const MAILING_USER = options.gmail.MAILING_USER;
const MAILING_PASS = options.gmail.MAILING_PASS;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: MAILING_USER,
        pass: MAILING_PASS
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
})

export const recoverPassword = async (email, token) => {
    const url = `http://localhost:8080/resetpassword?token=${token}`;
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
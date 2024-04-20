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

export const sendPurchaseEmail = async (email, ticketProducts, rejectedProducts) => {
    let emailContent = `
        <div>
            <h2>Purchase Ticket</h2>
            <h3>Ticket Products</h3>
            <ul>
                ${ticketProducts.map(item => `
                    <li>
                        <strong>Title:</strong> ${item.product.title}<br>
                        <strong>Description:</strong> ${item.product.description}<br>
                        <strong>Price:</strong> $${item.product.price}<br>
                        <strong>Quantity:</strong> ${item.quantity}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    // Verificar si hay productos rechazados para agregar la sección correspondiente
    if (rejectedProducts.length > 0) {
        emailContent += `
            <h3>Rejected Products</h3>
            <ul>
                ${rejectedProducts.map(item => `
                    <li>
                        <strong>Title:</strong> ${item.product.title}<br>
                        <strong>Description:</strong> ${item.product.description}<br>
                        <strong>Price:</strong> $${item.product.price}<br>
                        <strong>Quantity:</strong> ${item.quantity}
                    </li>
                `).join('')}
            </ul>
        `;
    }

    try {
        // Enviar el correo electrónico con el contenido generado
        await transporter.sendMail({
            from: MAILING_USER,
            to: email,
            subject: 'Purchase Ticket',
            html: emailContent
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export const recoverPassword = async (email, token) => {
    const url = `http://localhost:8080/restorePassword?token=${token}`;
    try {
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
    } catch (error) {
        console.error('Error sending email:', error);
    }
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
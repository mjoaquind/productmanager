import { Router } from 'express';
import UserManager from '../dao/mongoManagers/UserManager.js';
import { createHash, validatePassword } from '../utils.js';

const router = Router();

const userManager = new UserManager();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        const existsEmail = await userManager.getByEmail(email);

        if (existsEmail) {
            return res.status(400).send({ status: "error", error: `Email ${email} already exists` });
        }

        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        }

        const result = await userManager.createUser(user);
        res.status(200).send({ status: "success", message: "User created successfully", user: result });
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userManager.getByEmail(email);
        const isValidPassword = validatePassword(password, user.password);
        if (!user || !isValidPassword) {
            return res.status(400).send({ status: "error", message: "User not found" });
        }

        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            req.session.user = {
                full_name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: 'admin'
            }
        } else {
            req.session.user = {
                full_name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: 'user'
            }
        }

        res.status(200).send({
            status: "success",
            message: "User logged in successfully",
            payload: req.session.user
        });
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

router.get('/logout', (req, res) => {
    try {
        req.session.destroy(err => {
            if(err) {
                return res.status(500).send({ status: "error", error: "Can't log out" });
            }
            res.redirect('/login')
        });
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

export default router;
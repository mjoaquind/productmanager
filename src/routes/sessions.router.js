import { Router } from 'express';
import UserManager from '../dao/mongoManagers/UserManager.js';
import { createHash, validatePassword } from '../utils.js';
import passport from 'passport';

const router = Router();

const userManager = new UserManager();

/*router.post('/register', async (req, res) => {
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
})*/

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failregister' }),
async (req, res) => {
    res.send({ status: "success", message: "User created successfully", user: req.user })
})

router.get('failregister', async (req, res) => {
    console.log('Register failed');
    res.send({ status: "error", message: "Register failed" })
})

/*router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userManager.getByEmail(email);
        const isValidPassword = validatePassword(password, user);
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
})*/

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }),
async (req, res) => {
    if(!req.user) {
        return res.status(400).send({ status: "error", message: "User not found" });
    }
/*    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    }*/

    if (req.user.email === 'adminCoder@coder.com' && req.user.password === 'adminCod3r123') {
        req.session.user = {
            full_name: `${req.user.first_name} ${req.user.last_name}`,
            email: req.user.email,
            age: req.user.age,
            role: 'admin'
        }
    } else {
        req.session.user = {
            full_name: `${req.user.first_name} ${req.user.last_name}`,
            email: req.user.email,
            age: req.user.age,
            role: 'user'
        }
    }

    res.send({ status: "success", message: "User logged in successfully", payload: req.session.user })
})

router.get('/faillogin', (req, res) => {
    console.log('Login failed');
    res.send({ status: "error", message: "Login failed" })
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

router.post('/resetPassword', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ status: "error", message: "Email and password are required" });
        }
        const user = await userManager.getByEmail(email);
        if (!user) {
            return res.status(400).send({ status: "error", message: "User not found" });
        }
        const newPassword = createHash(password);
        await userManager.updatePassword(user._id, newPassword);
        res.status(200).send({ status: "success", message: "Password reset successfully" });
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
})

export default router;
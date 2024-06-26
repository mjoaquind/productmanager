import { userService } from '../repository/index.js';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import { generateEmailToken, recoverPassword, verifyEmailToken } from '../utils/gmail.js';


class SessionController {
    static register = async (req, res) => {
        req.logger.info("Registering user");
        res.send({ status: "success", message: "User created successfully", user: req.user })
    }

    static failRegister = async (req, res) => {
        req.logger.error("Register failed");
        res.send({ status: "error", message: "Register failed" })
    }

    static githubcallback = async (req, res) => {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        }
        res.redirect('/products');
    }

    static login = async (req, res) => {
        if(!req.user) {
            req.logger.error("User not found");
            return res.status(400).send({ status: "error", message: "User not found" });
        }
        
        if (req.user.email === 'adminCoder@coder.com' && req.user.password === 'adminCod3r123') {
            req.logger.info("Login admin");
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: 'admin'
            }
        } else {
            req.logger.info(`Login ${req.user.email} with role ${req.user.role}`);
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role
            }
        }
    
        await userService.updateLastConnection(req.user._id);
        req.logger.info("Login successful");
        res.send({ status: "success", message: "User logged in successfully", payload: req.session.user })
    }

    static faillogin = (req, res) => {
        req.logger.error("Login failed");
        res.send({ status: "error", message: "Login failed" })
    }

    static logout =  async(req, res) => {
        try {
            req.session.destroy(err => {
                if(err) {
                    return res.status(500).send({ status: "error", error: "Can't log out" });
                }
                
                req.logger.info("User logged out");
                res.redirect('/login')
            });
            await userService.updateLastConnection(req.user._id);
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static resetPassword = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).send({ status: "error", message: "Email and password are required" });
            }
            const user = await userService.getByEmail(email);
            if (!user) {
                return res.status(400).send({ status: "error", message: "User not found" });
            }
            const newPassword = createHash(password);
            await userService.updatePassword(user._id, newPassword);
            req.logger.info("Password reset successfully");
            res.status(200).send({ status: "success", message: "Password reset successfully" });
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static current = async (req, res) => {
        try {
            if (req.session && req.session.user) {
                req.logger.info("User authenticated");
                res.send({ status: "success", payload: req.session.user });
            } else {
                req.logger.info("User not authenticated");
                res.send({ status: "error", message: "User not authenticated" });
            }
        } catch (error) {
            req.logger.error(error);
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static forgotPassword = async (req, res) => {
        try {
            const {email} = req.body;
            const user = await userService.getByEmail(email);
            if(!user) {
                res.send(`<div>El usuario no existe, <a href="/forgotPassword">¿Olviaste tu contraseña?</a></div>`)
            }

            const token = generateEmailToken(email, '1h');

            await recoverPassword(email, token);

            res.send(`<div>Se ha enviado un correo electronico a ${email}.</div>`)

        } catch (error) {
            req.logger.error(error);
            res.send(`<div>Error, <a href="/forgotPassword">¿Olviaste tu contraseña?</a></div>`)
        }
    }

    static restorePassword = async (req, res) => {
        try {
            const token = req.query.token;
            const {email, newPassword} = req.body;

            const validToken = verifyEmailToken(token);

            if (!validToken) {
                return res.send(`<div>El token ha expirado.</div>`)
            }

            const user = await userService.getByEmail(email);

            if (!user) {
                return res.send(`<div>El usuario no existe.</div>`)
            }

            if (validatePassword(newPassword, user)) {
                return res.send(`<div>No se puede usar la misma contraseña.</div>`)
            }

            await userService.updatePassword(user._id, createHash(newPassword));

            res.render('login', { message: 'Password changed successfully' })

        } catch (error) {
            req.logger.error(error);
            res.send(`<div>Error, contáctese con el administrador.</div>`)
        }
    }
}

export { SessionController }
import { userService } from '../repository/index.js';
import { createHash, validatePassword } from '../utils/bcrypt.js';


class SessionController {
    static register = async (req, res) => {
        res.send({ status: "success", message: "User created successfully", user: req.user })
    }

    static failRegister = async (req, res) => {
        console.log('Register failed');
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
            return res.status(400).send({ status: "error", message: "User not found" });
        }
        
        if (req.user.email === 'adminCoder@coder.com' && req.user.password === 'adminCod3r123') {
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: 'admin'
            }
        } else {
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role
            }
        }
    
        res.send({ status: "success", message: "User logged in successfully", payload: req.session.user })
    }

    static faillogin = (req, res) => {
        console.log('Login failed');
        res.send({ status: "error", message: "Login failed" })
    }

    static logout = (req, res) => {
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
            res.status(200).send({ status: "success", message: "Password reset successfully" });
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }

    static current = async (req, res) => {
        try {
            if (req.session && req.session.user) {
                res.send({ status: "success", payload: req.session.user });
            } else {
                res.send({ status: "error", message: "User not authenticated" });
            }
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    }
}

export { SessionController }
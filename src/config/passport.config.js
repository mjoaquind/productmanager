import passport from 'passport';
import local from 'passport-local';
import UserManager from '../dao/mongoManagers/UserManager.js';
import { createHash, validatePassword } from '../utils.js';

const userManager = new UserManager();

const LocalStrategy = local.Strategy;

const initializePassport = () =>{
    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                const user = await userManager.getByEmail(username);
                if(user) {
                    console.log("El usuario ya existe");
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                const result = await userManager.createUser(newUser);
                return done(null, result);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use("login", new LocalStrategy(
    {usernameField:"email"},
    async (username, password, done)=>{
        try {
            const user = await userManager.getByEmail(username);
            if(!user || !validatePassword(password, user)){
                return done(null, false);
            } 
            return done(null, user)
        } catch (error) {
            return done(error);
        }
    }))
    
    passport.serializeUser((user,done)=>{
        done(null, user._id)
    });

    passport.deserializeUser(async (id,done)=>{
        const user = await userManager.getUserById(id);
        done(null, user);
    });
}

export default initializePassport;
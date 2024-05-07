import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import { UserDAO } from '../dao/managers/mongo/UserDAO.js';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import { options } from './config.js';

const userDAO = new UserDAO();

const LocalStrategy = local.Strategy;

const initializePassport = () =>{
    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                const user = await userDAO.getByEmail(username);
                if(user) {
                    console.log("User already exists");
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                const result = await userDAO.createUser(newUser);
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
            const user = await userDAO.getByEmail(username);
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
        const user = await userDAO.getUserById(id);
        done(null, user);
    });

    passport.use('github', new GitHubStrategy({
        clientID: options.github.id,
        clientSecret: options.github.secret,
        //callbackURL:'https://productmanager-production-7160.up.railway.app//api/session/githubcallback'
        callbackURL:'http://localhost:8080/api/session/githubcallback'
    }, async(accesToken, refreshToken, profile, done)=>{
        try {
            const first_name = profile._json.name;
            const last_name = "";
            let email = profile._json.email;
            if(!profile._json.email){
                email = profile._json.username;
            }
            const user = await userDAO.getByEmail(profile._json.email);
            if(user){
                console.log('User already exists, session created');
                return done(null, user)
                // return done(null, false);
                // si dejo en false no me redirecciona a la pagina principal
            }
            const newUser = {
                first_name,
                last_name: "",
                email,
                age: 18,
                password: ""
            }
            const result = await userDAO.createUser(newUser);
            return done (null, result);
        } catch (error) {
            return done(error)
        }
    }));
}

export default initializePassport;
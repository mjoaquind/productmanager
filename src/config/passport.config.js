import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
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

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.1b0c62f134311aca',
        clientSecret:'5bc0d868c67aa54b958d9cc811fd6d17837c235f',
        callbackURL:'http://localhost:8080/api/session/githubcallback'
    }, async(accesToken, refreshToken, profile, done)=>{
        try {
            //console.log(profile);
            const first_name = profile._json.name;
            const last_name = "";
            const email = profile._json.email;
            if(!profile._json.email){
                email = profile._json.username;
            }
            const user = await userManager.getByEmail(profile._json.email);
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
            const result = await userManager.createUser(newUser);
            return done (null, result);
        } catch (error) {
            return done(error)
        }
    }));
}

export default initializePassport;
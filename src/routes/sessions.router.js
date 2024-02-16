import { Router } from 'express';
import passport from 'passport';
import { SessionController } from '../controllers/sessions.controller.js';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failregister' }), SessionController.register);

router.get('failregister', SessionController.failRegister);

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {});

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), SessionController.githubcallback);

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }), SessionController.login);

router.get('/faillogin', SessionController.faillogin);

router.get('/logout', SessionController.logout);

router.post('/resetPassword', SessionController.resetPassword);

router.get('/current', SessionController.current);

export default router;
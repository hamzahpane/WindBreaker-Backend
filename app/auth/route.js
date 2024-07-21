const router = require('express').Router();
const passport = require('passport');
const autControl = require('./control');
const localStartegy = require('passport-local').Strategy;


passport.use(new localStartegy({usernameField:'email'}, autControl.localStrategy));
router.post('/regis', autControl.register);
router.post('/login',autControl.login);
router.post('/logout',autControl.logout);
router.get('/me' , autControl.me);

module.exports = router;
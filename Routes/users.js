const express = require('express');
const passport = require('passport');

const router = express.Router();


router.post('/login', (req, res, next) => {
  passport.authenticate('login', {
    successRedirect: '/success',
   failureRedirect: '/failure'
  })(req, res, next);
});

router.post('/register', (req, res, next) => {
  passport.authenticate('register', {
    successRedirect: '/success',
   failureRedirect: '/failure'
  })(req, res, next);
});

router.post('/forgetPassword', (req, res, next) => {
  passport.authenticate('forgetPassword', {
    successRedirect: '/success',
   failureRedirect: '/failure'
  })(req, res, next);
});



module.exports = router;
const express = require('express');
const passport = require('passport');

const router = express.Router();


router.post('/', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
   failureRedirect: '/login'
  })(req, res, next);
});



module.exports = router;
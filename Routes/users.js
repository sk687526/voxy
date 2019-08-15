const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');



const router = express.Router();


router.post('/login',  (req, res) => {
  passport.authenticate('login', 
    /*{
    successRedirect: '/redirect/successLogin',
   failureRedirect: '/redirect/failureLogin'
  })(req, res, next);*/
   { session: false },
    (error, user) => {
      console.log(error);
      if (error || !user) {
        return res.status(400).json({ error });
      }

      /** This is what ends up in our JWT */
      
      var payload = {
        firstName: user.firstName,
        lastName: user.lastName
        };
        //var secret = user.email;

      /** assigns payload to req.user */
      req.login(payload, {session: false}, (error) => {
        if (error) {
          return res.status(400).send({ error });
        }

        /** generate a signed json web token and return it in the response */
       const token = jwt.sign(payload, user.email, { expiresIn: '1h' });
        console.log(user);
        /** assign our jwt to the cookie */
        res.cookie('accessToken', token, { httpOnly: true, secure: true });
        res.status(200).send( {user });
      });
    },
  )(req, res);

});

router.get('/verifyregister/:email/:token', (req, res, next) => {
  var secret = req.params.email;
      
  var payload = jwt.verify(req.params.token, secret);
  req.body.email = payload.email;
  req.body.password = payload.password;

  passport.authenticate('register', 
    /*{
    successRedirect: '/redirect/successRegister',
   failureRedirect: '/redirect/failureRegister'
  })(req, res, next);*/
   { session: false },
    (error, user) => {
      console.log(error);
      if (error || !user) {
        return res.status(400).json({ error });
      }

      /** This is what ends up in our JWT */
      
      var payload = {
        firstName: user.firstName,
        lastName: user.lastName
        };
        //var secret = user.email;

      /** assigns payload to req.user */
      req.login(payload, {session: false}, (error) => {
        if (error) {
          return res.status(400).send({ error });
        }

        /** generate a signed json web token and return it in the response */
       const token = jwt.sign(payload, user.email, { expiresIn: '1h' });
        console.log(user);
        /** assign our jwt to the cookie */
        res.cookie('accessToken', token, { httpOnly: true, secure: true });
        res.status(200).send( {user });
      });
    },
  )(req, res);
});

router.post('/register', async(req, res) => {
  console.log(process.env.HOST);
  let user;
      try{
      user = await User.findOne({email: req.body.email});
        }
        catch(err){
          console.log(err);
          return res.send(err);
        }
      if(user){
        console.log(user);
        console.log("user already exists");
        return res.send("user already exists");
      }
      if(req.body.password !== req.body.confirmPassword){
        console.log("password do not matches");
        return res.send(`passwords don't matches`);
      }
      if(req.body.password.length < 6 && req.body.firstName.length < 3 && req.body.lastName.length < 3 ){
        console.log("please enter details correctly");
        return res.send('please enter details correctly');
      }

      var payload = {
            firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
        };

        // TODO: Make this a one-time-use token by using the user's
        // current password hash from the database, and combine it
        // with the user's created date to make a very unique secret key!
        // For example:
        var secret = req.body.email;
     const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        // TODO: Send email containing link to reset password.
        var transporter = nodemailer.createTransport({
       host: process.env.HOST,
        port: process.env.PORT_SMTP,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
      });

            const url = `${process.env.DOMAIN}/users/verifyregister/${payload.email}/${token}`;

      var mailOptions = {
        from: process.env.USER,
        to: req.body.email,
        subject: 'register link',
        html: `<html><a href="${url}">Click here to register</a></html>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("sending error:" + error);
                return res.send(error);
        } else {
          console.log('Email sent: ' + info.response);
                return res.send(info.response);
        }
      });

  });





module.exports = router;
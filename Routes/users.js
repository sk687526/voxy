const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const querystring = require('querystring');


const router = express.Router();


router.post('/login',  (req, res) => {
  passport.authenticate('login', 
    /*{
    successRedirect: '/redirect/successLogin',
   failureRedirect: '/redirect/failureLogin'
  })(req, res, next);*/
   { session: false },
    (err, user) => {
      console.log(err);
      if (err || !user) {
        return res.status(400).json({ error: err});
      }

      /** This is what ends up in our JWT */
      
      var payload = {
        displayName: user.displayName
        };
        //var secret = user.email;

      /** assigns payload to req.user */
      req.login(payload, {session: false}, (error) => {
        if (error) {
          return res.status(400).send({ error: error });
        }

        /** generate a signed json web token and return it in the response */
       const token = jwt.sign(payload, user.email, { expiresIn: '1h' });
        console.log(user);
        const obj = {
          isLoggedIn: true,
          data: {
            displayName: user.displayName,
            email: user.email,
            username: user.username
          },
          accessToken: token
        }
        console.log(user.username);
        /** assign our jwt to the cookie */
        req.withCredentials = true;
        var userCookie = {
          accessToken: token,
          data: obj
        }
        var cookieString = `accessToken=${token};data=${obj};httpOnly;max-age=${60*60*24*15};SameSite=Strict;expires=`;
        //res.cookie('user', obj.data, domain='127.0.0.1', {httpOnly: true, secure: false, expires: new Date(Date.now() + 7*24*3600000)});
        //res.cookie('accessToken', token, domain='127.0.0.1', {httpOnly: true, secure: false, expires: new Date(Date.now() + 7*24*3600000)});
        res.cookie('isLoggedIn', true, domain='https://serene-hugle-0773de.netlify.com', {httpOnly: true, secure: false, expires: new Date(Date.now() + 7*24*3600000)});
        res.cookie('email', JSON.stringify(user.email), domain='https://serene-hugle-0773de.netlify.com', {httpOnly: true, secure: false, expires: new Date(Date.now() + 7*24*3600000)});
        //res.setHeader('x-access-token', token);
        //res.setHeader('Set-Cookie', cookieString);
        res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
        //res.end("s");
        
       /* res.writeHead(200, {
          "Content-Type" : "text/plain",
          "Set-Cookie" : cookieString
        });*/
        res.status(200).send( {obj });
      });
    },
  )(req, res);

});

router.get('/verifyregister/:email/:token', (req, res, next) => {
  var secret = req.params.email;
    try{  
  var payload = jwt.verify(req.params.token, secret);
  }
  catch(err){
    console.log("jwt expired");
    return res.send(err);
  }

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
        return res.status(400).json({ error: error });
      }

      /** This is what ends up in our JWT */
      var payload1  = {
        displayName: user.displayName,
        email: user.email
      }
      
        //var secret = user.email;

      /** assigns payload to req.user */
      req.login(payload1, {session: false}, (error) => {
        if (error) {
          return res.status(400).send({ error: error });
        }

        /** generate a signed json web token and return it in the response */
       const token = jwt.sign(payload1, user.email, { expiresIn: '1h' });
        console.log(user);
        res.cookie('accessToken', token, { httpOnly: true, secure: true });
        /** assign our jwt to the cookie */
        const query = querystring.stringify(payload1);
      res.redirect('http://localhost:3000/apps/dashboards/analytics/?' + query);
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
        return res.send({error: "user already exists"});
      }
      if(req.body.password !== req.body.confirmPassword){
        console.log("password do not matches");
        return res.send({error: "passwords don't matches"});
      }
      console.log(req.body.password);
     

      var payload = {
            displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
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
                return res.send({error: error});
        } else {
          console.log('Email sent: ' + info.response);
                return res.send({info: info.response});
        }
      });

  });

router.post('/suggestions', async(req, res, next) => {
  console.log(req.body);
  try{  
  var payload = jwt.verify(JSON.parse(req.body.accessToken), req.body.email);
  }
  catch(err){
    console.log("jwt expired");
    return res.status(400).send(err);
  }
  let users = await User.find();
  console.log(users);
  res.send(users); 
});

router.post('/user', async(req, res, next) => {
  console.log(req.body.accessToken);
  console.log(req.body.email);
  //console.log(JSON.object(req.body));
  try{  
  var payload = jwt.verify(JSON.parse(req.body.accessToken), req.body.email);
  }
  catch(err){
    console.log("jwt expired");
    return res.status(400).send(err);
  }
  let user = await User.findOne();
  console.log(user);
  const obj = {
          isLoggedIn: true,
          data: {
            displayName: user.displayName,
            email: user.email,
            username: user.username
          },
          accessToken: req.body.accessToken
        }
  res.status(200).send( {obj });
});





module.exports = router;
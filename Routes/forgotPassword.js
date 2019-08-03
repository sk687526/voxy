const express = require('express');
const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const User = require('../models/User');
var nodemailer = require('nodemailer');
const router = express.Router();

router.get('/forgotpassword', (req, res) => {
    res.send('<form action="/user/passwordreset" method="POST">' +
        '<input type="email" name="email" value="" placeholder="Enter your email address..." />' +
        '<input type="submit" value="Reset Password" />' +
    '</form>');
});

router.post('/passwordreset', async(req, res) => {
    if (req.body.email !== undefined) {
        var email = req.body.email;

        // TODO: Using email, find user from your database.
        let user;
			try{
			user = await User.findOne({email: email});
		    }
		    catch(err){
		    	console.log(err);
		    }

		if(!user){
			return res.send("invalid email");
		}
        var payload = {
            id: user._id,        // User ID from database
            email: email
        };

        // TODO: Make this a one-time-use token by using the user's
        // current password hash from the database, and combine it
        // with the user's created date to make a very unique secret key!
        // For example:
        var secret = user.password;

        var token = jwt.encode(payload, secret);

        // TODO: Send email containing link to reset password.
        var transporter = nodemailer.createTransport({
			 host: 'smtp.gmail.com',
		    port: 587,
		    secure: false,
		    requireTLS: true,
		    auth: {
		        user: 'salman.k@aspirehive.com',
		        pass: 'ieytblbhplvduysb'
		    }
			});

			var mailOptions = {
			  from: 'salman.k@aspirehive.com',
			  to: email,
			  subject: 'Password reset link',
			  text: '<a href="/user/resetpassword/' + payload.id + '/' + token + '">Reset password</a>'
			};

			transporter.sendMail(mailOptions, (error, info) => {
			  if (error) {
			    console.log("sending error:" + error);
			  } else {
			    console.log('Email sent: ' + info.response);
			  }
			});
		    } else {
		        res.send('Email address is missing.');
		    }
});

router.get('/resetpassword/:id/:token', async(req, res) => {
    // TODO: Fetch user from database using
    // req.params.id
    let user;
	try{
	user = await User.findOne({_id: req.params.id});
    }
    catch(err){
    	console.log(err);
    }
    // TODO: Decrypt one-time-use token using the user's
    // current password hash from the database and combine it
    // with the user's created date to make a very unique secret key!
    // For example,
    var secret = user.password;
    var payload = jwt.decode(req.params.token, secret);

    // TODO: Gracefully handle decoding issues.
    // Create form to reset password.
    res.send('<form action="/user/resetpassword" method="POST">' +
        '<input type="hidden" name="id" value="' + payload.id + '" />' +
        '<input type="hidden" name="token" value="' + req.params.token + '" />' +
        '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
        '<input type="password" name="confirmPassword" value="" placeholder="confirm new password..." />' +
        '<input type="submit" value="Reset Password" />' +
    '</form>');
});

router.post('/resetpassword', async(req, res) => {
    // TODO: Fetch user from database using
    // req.body.id
    if(req.body.password !== req.body.confirmPassword){
    	return res.send("please enter same passwords");
    }
    let user;
	try{
	user = await User.findOne({_id: req.body.id});
    }
    catch(err){
    	console.log(err);
    }
    // TODO: Decrypt one-time-use token using the user's
    // current password hash from the database and combining it
    // with the user's created date to make a very unique secret key!
    // For example,
    var secret = user.password;

    var payload = jwt.decode(req.body.token, secret);
    user.password = req.body.password;
    try{
    await user.save();
    }catch(err){
    	return res.send("something went wrong");
    }
    // TODO: Gracefully handle decoding issues.
    // TODO: Hash password from
    // req.body.password
    res.send('Your password has been successfully changed.');
});

module.exports = router;



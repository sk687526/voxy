const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Load user model
const User = require('../models/User');

module.exports = function(passport){
	passport.use('login',
		new LocalStrategy({ usernameField: 'email'}, async(email, password, done) => {
			//Match User
			console.log("inside login");
			console.log(password);
			let user = await User.findOne({email: email});
			console.log(user);
				if(!user){
					console.log("going back");
					return done(null, false, {message: 'the email is not registered'});
				}
				console.log("not going");
				//Match password
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if(isMatch){
						console.log("matched");
						return done(null, user);
					}else{
						return done(null, false, {message: 'password incorrect'});
					}
				});
			})
		);
			
		

	passport.serializeUser((user, done) => {
		console.log("serializeUser");
		done(null, user._id);
	});

	passport.deserializeUser((id, done) => {
		console.log("deserializeUser");
		User.findById(id, (err, user) => {
			if(err){
                done(err);
            }
            else{
			done(err, user);
		}
		});
	});
}
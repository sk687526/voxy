const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Load user model
const User = require('../models/User');

module.exports = function(passport){
	passport.use('login',
		new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
			//Match User
			console.log("inside login");
			User.findOne({email: email})
			.then(user => {
				if(!user){
					return done(null, false, {message: 'the email is not registered'});
				}
				//Match password
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if(isMatch){
						return done(null, user);
					}else{
						return done(null, false, {message: 'password incorrect'});
					}
				});
			})
			.catch(err => console.log(err));
		})
		);

	passport.serializeUser((user, done) => {
		console.log("serializeUser");
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		console.log("deserializeUser");
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
}
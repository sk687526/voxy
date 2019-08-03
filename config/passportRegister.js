const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Load user model
const User = require('../models/User');

module.exports = function(passport){
	passport.use('register',
		new LocalStrategy({ usernameField: 'email', passReqToCallback: true}, async (req, email, password, done) => {
			console.log("inside register");
			let user;
			try{
			user = await User.findOne({email: email});
		    }
		    catch(err){
		    	console.log(err);
		    }
			if(user){
				console.log("user already exists");
				return done(null, false, {message: 'user already exists'});
			}
			if(password !== req.body.confirmPassword){
				console.log("password do not matches");
				return done(null, false, {message: `passwords don't matches`});
			}
			if(password.length < 6 && firstName.length < 3 && lastName.length < 3 ){
				console.log("please enter details correctly");
				return done(null, false, {message: 'please enter details correctly'});
			}

		    user = new User({
		  	firstName: req.body.firstName,
		  	lastName: req.body.lastName,
		  	email: email,
		  	password: password
		  });

		  const salt = await bcrypt.genSalt(10);
		  user.password = await bcrypt.hash(user.password, salt);

		  await user.save();
		  return done(null, user);

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
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


//Load user model
const User = require('../models/User');

module.exports = function(passport){
	passport.use('register',
		new LocalStrategy({ usernameField: 'email', passReqToCallback: true}, async (req, email, password, done) => {
			console.log("inside register");

			var secret = req.params.email;
		   try {
		     var payload = jwt.verify(req.params.token, secret);
		    } catch(err) {
		      // err
		      return done(err);
		    }

		   console.log(payload);

		   user = new User({
		        firstName: payload.firstName,
		        lastName: payload.lastName,
		        email: payload.email,
		        password: payload.password
		      });

		      const salt = await bcrypt.genSalt(10);
		      user.password = await bcrypt.hash(user.password, salt);
		      try{
		      await user.save();
		  	  }
		  	  catch(err) {
		  	  	console.log(err);
		  	  	return done(err);
		  	  };
		      return done(null, user);
					
		}
		));
		

	/*passport.serializeUser((user, done) => {
		console.log("serializeUser");
		done(null, user._id);
	});

	passport.deserializeUser((id, done) => {
		console.log("deserializeUser");
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});*/
}
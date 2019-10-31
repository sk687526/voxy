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
		      return done("token expired");
		    }
		    let user1;
		      try{
		      user1 = await User.findOne({email: payload.email});
		        }
		        catch(err){
		          console.log(err);
		          return done("something went wrong");
		        }
		      if(user1){
		        console.log(user1);
		        console.log("user already exists");
		        return done("user already exists");
		      }

		   console.log(payload);

		   user = new User({
		        displayName: payload.displayName,
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
const FacebookStrategy = require('passport-facebook');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Load user model
const User = require('../models/User');

module.exports = function(passport){
	    passport.use(new FacebookStrategy({
	    clientID: process.env.APP_ID,
	    clientSecret: process.env.APP_SECRET,
	    callbackURL: process.env.FACEBOOK_CALLBACK_URL
	  },
	  function(accessToken, refreshToken, profile, cb) {
	    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
	      return cb(err, user);
	    });
	  }
	));

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
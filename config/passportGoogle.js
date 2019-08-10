var GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Load user model
const User = require('../models/User');

module.exports = function(passport){
	    passport.use(new GoogleStrategy({
	    clientID: process.env.GOOGLE_CLIENT_ID,
	    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	    callbackURL: process.env.GOOGLE_CALLBACK_URL
	  },
	  function(accessToken, refreshToken, profile, cb) {
	    User.findOrCreate({ googleId: profile.id }, function (err, user) {
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
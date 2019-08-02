const mongoose = require('mongoose');
const {User} = require('./Models/User');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local');
var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const login = require('./Routes/login');
const register = require('./Routes/register');
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost/fuse',{ useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
	function(firstName, lastName, email, password, done) {
		console.log(firstName);
		//Search for user
		User.find({ where: {email: email} }).success(function(user) {

			//If no user register a new one
			if (!user) {

				const salt = bcrypt.genSalt(10);
  				newPassword = bcrypt.hash(user.password, salt);

				user = new User({
			  	firstName: firstName,
			  	lastName: lastName||null,
			    email: email,
			  	password: newPassword
		  		});

				user.save().success(function(savedUser) {
					console.log('Saved user successfully: %j', savedUser);
					return done(null, savedUser);
					
				}).error(function(error) {
					console.log(error);
					return done(null, false, { message: 'Something went wrong in registration' });
				});
			}
			
			//Found user check password
			
				return done(null, false, { message: 'User already exists' });
			
		});
	}
));

app.post('/users/register', passport.authenticate('local'));



app.use(express.json());
app.post('/users/register', passport.authenticate('local'), function(req, res) {
	console.log('Logging in as: ' + req.user);
	
	res.send({success: 'success'});
});
app.use('/login', login);
app.use('/register', register);

  const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
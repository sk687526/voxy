var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const users = require('./Routes/users');
const forgotPassword = require('./Routes/forgotPassword');

const app = express();

//passport config
require('./config/passportLogin')(passport);
require('./config/passportRegister')(passport);

mongoose.connect('mongodb://localhost/fuse',{ useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

//express session
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use('/users', users);
app.use('/user', forgotPassword);

app.get('/success', (req, res) => {
	console.log(req);
	  console.log("success");
 res.send("success");
});

app.get('/failure', (req, res) => {
	console.log(req.message);
	  console.log("failure");
 res.send("failure");
});


  const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
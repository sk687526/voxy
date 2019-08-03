var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const login = require('./Routes/login');
const register = require('./Routes/register');

const app = express();

//passport config
require('./config/passport')(passport);

app.use(bodyParser.json());
app.use(cors());

//express session
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost/fuse',{ useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/login', login);
app.use('/register', register);

  const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
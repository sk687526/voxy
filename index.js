var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
//const session = require('express-session');
//const cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
const passport = require('passport');
const users = require('./Routes/users');
const forgotPassword = require('./Routes/forgotPassword');
const socialLogin = require('./Routes/socialLogin');

const app = express();
const dotenv = require('dotenv');
dotenv.config();


//passport config
require('./config/passportLogin')(passport);
require('./config/passportRegister')(passport);
require('./config/passportFacebook')(passport);
require('./config/passportGoogle')(passport);

mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...' + err));

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials:  true
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.json());

/*express session
app.use(session({
	secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));*/

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Credentials', true)
 // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', socialLogin);
app.use('/users', users);
app.use('/user', forgotPassword);



app.get('/login', (req, res) => {
	console.log("login success");
	res.json({
 	from: "mongodb",
 	role: "staff",
 	uuid: "123456"
 });
})


  const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
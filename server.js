const mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const login = require('./Routes/login');
const register = require('./Routes/register');
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost/fuse',{ useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/login', login);
app.use('/register', register);

  const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
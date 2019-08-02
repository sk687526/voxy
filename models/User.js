const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 250
  }
});

const User = mongoose.model('user', userSchema);



exports.User = User; 
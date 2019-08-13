
const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

//const User = mongoose.model('User', UserSchema);


UserSchema = mongoose.model('User', UserSchema);



module.exports = UserSchema; 
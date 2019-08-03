
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

try {
UserSchema = mongoose.model('User', UserSchema);
} catch (e) {
UserSchema = mongoose.model('User');
}


module.exports = UserSchema; 
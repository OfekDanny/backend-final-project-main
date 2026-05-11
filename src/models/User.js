const mongoose = require('mongoose');

/* Schema for the users collection */
const userSchema = new mongoose.Schema({
  id: Number,
  firstName: String,
  lastName: String,
  birthday: String
});

// Register the User model
const User = mongoose.model('User', userSchema);
module.exports = User;

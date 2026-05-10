const mongoose = require('mongoose');

/* Schema for the users collection */
const userSchema = new mongoose.Schema({
  id: { type: Number },
  firstName: { type: String },
  lastName: { type: String },
  // Stored as a Date for proper querying
  birthday: { type: Date }
});

// Register the User model
const User = mongoose.model('User', userSchema);
module.exports = User;

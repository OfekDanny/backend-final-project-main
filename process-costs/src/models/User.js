const mongoose = require('mongoose');

/* Read-only reference to the users collection for validating userid */
const userSchema = new mongoose.Schema({
  // Numeric user ID used to match against cost records
  id: { type: Number }
});

// Register the User model
const User = mongoose.model('User', userSchema);
module.exports = User;

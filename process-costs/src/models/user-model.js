const mongoose = require('mongoose');

// Read-only reference to the users collection for validating userid
const userSchema = new mongoose.Schema({
  id: { type: Number }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

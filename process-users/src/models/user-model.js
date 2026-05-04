const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number },
  first_name: { type: String },
  last_name: { type: String },
  birthday: { type: Date }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

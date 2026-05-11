const User = require('../models/User');

/* Returns true if the user exists in the database; sends a 400 response and returns false otherwise */
const isValidUser = async (userId, res) => {
  try {
    // Look up user by their numeric ID
    const user = await User.findOne({ id: userId });
    if (!user) {
      res.status(400).json({ status: 'fail', message: 'User not found' });
      return false;
    }
    // User exists
    return true;
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
    return false;
  }
};

module.exports = isValidUser;

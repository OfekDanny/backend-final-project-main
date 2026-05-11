const User = require('../models/User');
const Cost = require('../models/Expense');
const Report = require('../models/Report');

// Remove all reports from the database
const removeReports = async (req, res) => {
  try {
    // Delete every document in the reports collection
    await Report.deleteMany({});
    // Confirm successful deletion
    res.status(200).json({ status: 'success', message: 'All reports have been deleted successfully' });
  // Surface the error message for debugging
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'An error occurred while deleting reports', error: err.message });
  }
};

// Remove all users from the database
const removeUsers = async (req, res) => {
  try {
    // Delete every document in the users collection
    await User.deleteMany({});
    // Return success confirmation
    res.status(200).json({ status: 'success', message: 'All users have been deleted successfully' });
  // Surface the error message for debugging
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'An error occurred while deleting users', error: err.message });
  }
};

// Remove all expenses and their associated reports from the database
const removeExpenses = async (req, res) => {
  try {
    // Delete reports first to keep data consistent
    await Report.deleteMany({});
    await Cost.deleteMany({});
    // Confirm successful deletion
    res.status(200).json({ status: 'success', message: 'All expenses have been deleted successfully' });
  // Surface the error message for debugging
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'An error occurred while deleting expenses', error: err.message });
  }
};

module.exports = { removeUsers, removeExpenses, removeReports };
